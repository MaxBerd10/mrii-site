from django.urls import path

from . import api, hr_api

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
    # Telegram HR Mini App (initData-authenticated, allow-listed accounts only)
    path('hr/me/', hr_api.HrMeAPI.as_view()),
    path('hr/vacancies/', hr_api.HrVacancyListAPI.as_view()),
    path('hr/vacancies/<int:pk>/', hr_api.HrVacancyDetailAPI.as_view()),
    path('hr/applications/', hr_api.HrApplicationListAPI.as_view()),
    path('hr/applications/<int:pk>/', hr_api.HrApplicationDetailAPI.as_view()),
    path('hr/applications/<int:pk>/resume/', hr_api.HrApplicationResumeAPI.as_view()),
]
