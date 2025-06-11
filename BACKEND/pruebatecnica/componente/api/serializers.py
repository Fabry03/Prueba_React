from rest_framework import serializers
from componente.models import componente, Medicion 

class ComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = componente
        fields = '__all__'  # Serializa todos los campos del modelo componente


class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = '__all__'