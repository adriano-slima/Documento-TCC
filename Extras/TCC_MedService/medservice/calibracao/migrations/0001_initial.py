# Generated by Django 5.1.7 on 2025-04-07 00:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ordens', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Analisador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('marca', models.CharField(max_length=100)),
                ('modelo', models.CharField(max_length=100)),
                ('numero_serie', models.CharField(max_length=100)),
                ('patrimonio', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='CabCalibracao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_execucao', models.DateField()),
                ('data_emissao', models.DateField()),
                ('data_validade', models.DateField()),
                ('temp_ambiente', models.DecimalField(decimal_places=2, max_digits=5)),
                ('umidade_relativa', models.DecimalField(decimal_places=2, max_digits=5)),
                ('executante', models.CharField(max_length=255)),
                ('responsavel', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('aberto', 'Aberto'), ('em_andamento', 'Em andamento'), ('concluido', 'Concluído')], default='aberto', max_length=20)),
                ('ordem_servico', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='calibracoes', to='ordens.ordemservico')),
            ],
        ),
        migrations.CreateModel(
            name='CertificadoAnalisador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_certificado', models.CharField(max_length=100)),
                ('data_calibracao', models.DateField()),
                ('data_validade', models.DateField()),
                ('calibrado_por', models.CharField(max_length=100)),
                ('analisador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='certificados', to='calibracao.analisador')),
            ],
        ),
        migrations.CreateModel(
            name='Parametro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100)),
                ('unidade_medida', models.CharField(max_length=50)),
                ('tolerancia_superior', models.DecimalField(decimal_places=4, max_digits=10)),
                ('tolerancia_inferior', models.DecimalField(decimal_places=4, max_digits=10)),
                ('analisadores', models.ManyToManyField(related_name='parametros_compatíveis', to='calibracao.analisador')),
            ],
        ),
        migrations.CreateModel(
            name='ModeloParametro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome_modelo', models.CharField(max_length=100)),
                ('parametro', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modelos', to='calibracao.parametro')),
            ],
        ),
        migrations.CreateModel(
            name='Medida',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor_referencia', models.DecimalField(decimal_places=4, max_digits=10)),
                ('leitura1', models.DecimalField(decimal_places=4, max_digits=10)),
                ('leitura2', models.DecimalField(decimal_places=4, max_digits=10)),
                ('leitura3', models.DecimalField(decimal_places=4, max_digits=10)),
                ('media', models.DecimalField(decimal_places=4, max_digits=10)),
                ('erro', models.DecimalField(decimal_places=4, max_digits=10)),
                ('indice_k', models.DecimalField(decimal_places=4, max_digits=10)),
                ('aprovacao', models.BooleanField()),
                ('analisador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medidas', to='calibracao.analisador')),
                ('laudo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medidas', to='calibracao.cabcalibracao')),
                ('parametro', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medidas', to='calibracao.parametro')),
            ],
        ),
        migrations.CreateModel(
            name='ValorModelo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor', models.DecimalField(decimal_places=4, max_digits=10)),
                ('modelo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='valores', to='calibracao.modeloparametro')),
            ],
        ),
    ]
