from django.contrib import admin
from .models import LaudoPreventiva, LaudoCalibracao

@admin.register(LaudoPreventiva)
class LaudoPreventivaAdmin(admin.ModelAdmin):
    list_display = ('id', 'ordem_servico', 'data_emissao', 'data_validade', 'executante', 'responsavel')
    search_fields = ('ordem_servico__id', 'executante', 'responsavel')
    list_filter = ('data_emissao', 'data_validade', 'data_criacao')
    readonly_fields = ('data_criacao',)

@admin.register(LaudoCalibracao)
class LaudoCalibracaoAdmin(admin.ModelAdmin):
    list_display = ('equipamento', 'numero_serie', 'data_calibracao', 'tecnico_responsavel', 'certificado', 'data_criacao')
    search_fields = ('equipamento', 'numero_serie', 'tecnico_responsavel', 'certificado')
    list_filter = ('data_calibracao', 'data_criacao')
