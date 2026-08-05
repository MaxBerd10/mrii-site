from django.urls import path

from . import api

urlpatterns = [
    path('settings/', api.SettingsAPI.as_view()),
    path('home/', api.HomeAPI.as_view()),
    path('specialties/', api.SpecialtyListAPI.as_view()),
    path('specialties/<slug:slug>/', api.SpecialtyDetailAPI.as_view()),
    path('doctors/', api.DoctorListAPI.as_view()),
    path('news/', api.NewsListAPI.as_view()),
    path('news/<slug:slug>/', api.NewsDetailAPI.as_view()),
    path('ai-products/', api.AIProductListAPI.as_view()),
    path('ai-products/<slug:slug>/', api.AIProductDetailAPI.as_view()),
    path('research/', api.ResearchAPI.as_view()),
    path('education/', api.EducationAPI.as_view()),
    path('clinic-tour/', api.ClinicTourListAPI.as_view()),
    path('vacancies/', api.VacancyListAPI.as_view()),
    path('inquiries/', api.InquiryCreateAPI.as_view()),
    path('inquiries/<str:request_id>/', api.InquiryAdviceAPI.as_view()),
]
