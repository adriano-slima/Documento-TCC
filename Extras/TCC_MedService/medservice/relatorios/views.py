from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from django.conf import settings
import os
from .models import LaudoPreventiva, LaudoCalibracao
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
from preventiva.models import CabPreventiva
from ordens.models import OrdemServico
import logging
from calibracao.models import CabCalibracao, Medida, ParametroCalibrado
from django.db.models import Prefetch
import tempfile

logger = logging.getLogger(__name__)

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@require_http_methods(["POST"])
def gerar_laudo_preventiva(request):
    try:
        data = json.loads(request.body)
        logger.info(f"Dados recebidos: {data}")
        
        # Buscar a ordem de serviço e o cabeçalho da preventiva
        ordem_servico = OrdemServico.objects.get(id=data['ordem_servico_id'])
        cab_preventiva = CabPreventiva.objects.get(id=data['cab_preventiva_id'])
        
        logger.info(f"Ordem de Serviço encontrada: {ordem_servico}")
        logger.info(f"Cabeçalho Preventiva encontrado: {cab_preventiva}")
        
        # Criar o laudo no banco de dados
        laudo = LaudoPreventiva.objects.create(
            ordem_servico=ordem_servico,
            cab_preventiva=cab_preventiva,
            data_emissao=data['data_emissao'],
            data_validade=data['data_validade'],
            executante=data['executante'],
            responsavel=data['responsavel'],
            consideracoes_finais=data.get('consideracoes_finais', '')
        )
        
        logger.info(f"Laudo criado: {laudo}")
        logger.info(f"Cliente: {laudo.cliente}")
        logger.info(f"Equipamento: {laudo.equipamento}")
        logger.info(f"Condições ambientais: {laudo.condicoes_ambientais}")
        
        # Preparar os dados para o template
        template_data = {
            'laudo': laudo,
            'temperatura': cab_preventiva.temp_ambiente,
            'umidade_relativa': cab_preventiva.umidade_relativa,
        }
        
        # Renderizar o template HTML
        html_string = render_to_string('relatorios/laudo_preventiva.html', template_data)
        
        # Gerar o PDF
        html = HTML(string=html_string)
        pdf = html.write_pdf()
        
        # Configurar a resposta
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="laudo_preventiva_{laudo.id}.pdf"'
        
        return response
        
    except Exception as e:
        logger.error(f"Erro ao gerar laudo: {str(e)}")
        return HttpResponse(f"Erro ao gerar laudo: {str(e)}", status=400)

@require_http_methods(["POST"])
def gerar_laudo_calibracao(request):
    try:
        data = json.loads(request.body)
        
        # Criar o laudo no banco de dados
        laudo = LaudoCalibracao.objects.create(
            equipamento=data['equipamento'],
            numero_serie=data['numero_serie'],
            data_calibracao=data['data_calibracao'],
            tecnico_responsavel=data['tecnico_responsavel'],
            certificado=data['certificado'],
            observacoes=data.get('observacoes', '')
        )
        
        # Renderizar o template HTML
        html_string = render_to_string('relatorios/laudo_calibracao.html', {
            'laudo': laudo,
        })
        
        # Gerar o PDF
        html = HTML(string=html_string)
        pdf = html.write_pdf()
        
        # Configurar a resposta
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="laudo_calibracao_{laudo.id}.pdf"'
        
        return response
        
    except Exception as e:
        return HttpResponse(f"Erro ao gerar laudo: {str(e)}", status=400)

def gerar_laudo_calibracao(request, laudo_id):
    try:
        # Busca o laudo com todos os dados relacionados
        laudo = CabCalibracao.objects.select_related(
            'ordem_servico'
        ).prefetch_related(
            Prefetch('parametros_calibrados', queryset=ParametroCalibrado.objects.select_related('parametro')),
            Prefetch('medidas', queryset=Medida.objects.select_related(
                'parametro',
                'analisador',
                'certificado'
            ))
        ).get(id=laudo_id)

        # Organiza as medidas por parâmetro
        medidas_por_parametro = {}
        for medida in laudo.medidas.all():
            if medida.parametro.id not in medidas_por_parametro:
                medidas_por_parametro[medida.parametro.id] = {
                    'parametro': medida.parametro,
                    'analisador': medida.analisador,
                    'certificado': medida.certificado,
                    'medidas': []
                }
            medidas_por_parametro[medida.parametro.id]['medidas'].append(medida)

        # Contexto para o template
        context = {
            'laudo': laudo,
            'medidas_por_parametro': medidas_por_parametro,
            'cliente': laudo.ordem_servico.cliente,
            'equipamento': laudo.ordem_servico.equipamento,
        }

        # Renderiza o template HTML
        html_string = render_to_string('relatorios/laudo_calibracao.html', context)
        
        # Gera o PDF diretamente em memória
        pdf = HTML(string=html_string).write_pdf()
        
        # Configura a resposta
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="laudo_calibracao_{laudo_id}.pdf"'
        
        return response
        
    except Exception as e:
        logger.error(f"Erro ao gerar laudo: {str(e)}")
        return HttpResponse(f"Erro ao gerar laudo: {str(e)}", status=400)
