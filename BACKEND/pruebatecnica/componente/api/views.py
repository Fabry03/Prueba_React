from rest_framework import viewsets
from componente.models import componente, Medicion
from componente.api.serializers import ComponenteSerializer, MedicionSerializer

class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = componente.objects.all()
    serializer_class = ComponenteSerializer

    def perform_create(self, serializer):
        serializer.save()  # Guarda el nuevo componente

class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer

    def perform_create(self, serializer):
        serializer.save()  # Guarda la nueva medición

    def get_queryset(self):
        queryset = super().get_queryset()
        componente_id = self.request.query_params.get('componente')
        if componente_id:
            queryset = queryset.filter(componente_id=componente_id)
        return queryset