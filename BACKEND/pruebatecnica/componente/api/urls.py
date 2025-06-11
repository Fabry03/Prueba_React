from rest_framework.routers import DefaultRouter
from componente.api.views import ComponenteViewSet, MedicionViewSet


router = DefaultRouter()
router.register(r'componentes', ComponenteViewSet, basename='componente')
router.register(r'mediciones', MedicionViewSet, basename='medicion')
urlpatterns = router.urls