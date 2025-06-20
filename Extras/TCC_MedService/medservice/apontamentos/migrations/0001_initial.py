# Generated by Django 5.1.7 on 2025-03-23 01:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ordens', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Apontamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.TextField()),
                ('status_no_momento', models.CharField(choices=[('aberta', 'Aberta'), ('aguardando envio do laudo', 'Aguardando Envio do Laudo'), ('executado - aguardando faturamento', 'Executado - Aguardando Faturamento'), ('aguardando envio do orçamento', 'Aguardando Envio do Orçamento'), ('aguardando aprovação', 'Aguardando Aprovação'), ('aguardando peça para continuar orçamento', 'Aguardando Peça para Continuar Orçamento'), ('aprovado - aguardando execução', 'Aprovado - Aguardando Execução'), ('reprovado', 'Reprovado'), ('finalizado', 'Finalizado')], max_length=50)),
                ('data', models.DateTimeField(auto_now_add=True)),
                ('ordem_servico', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='apontamentos', to='ordens.ordemservico')),
            ],
        ),
    ]
