import { GeneralSupportRequestType } from "@/constants/enums/GeneralRequestType";
import { useLanguage } from "@/context/LanguageContext";


export const getGeneralRequestTypeTitle = (type: GeneralSupportRequestType): string => {
    const { t } = useLanguage();
    switch (type) {
        case GeneralSupportRequestType.Other:
            return "Diğer";
        case GeneralSupportRequestType.TechnicalSupport:
            return "Teknik Destek";
        case GeneralSupportRequestType.Feedback:
            return "Geri Bildirim";
        case GeneralSupportRequestType.AccountHelp:
            return "Hesap Yardımı";
        default:
            return "Bilinmeyen Talep Tipi";
    }
};

export const getAllGeneralRequestTypes = (): { value: GeneralSupportRequestType; title: string }[] => {
    const { t } = useLanguage();
    return [
        { value: GeneralSupportRequestType.Other, title: t("generalSupportTicket.other") },
        { value: GeneralSupportRequestType.TechnicalSupport, title: t("generalSupportTicket.technicalSupport") },
        { value: GeneralSupportRequestType.Feedback, title: t("generalSupportTicket.feedback") },
        { value: GeneralSupportRequestType.AccountHelp, title: t("generalSupportTicket.accountHelp") },
    ];
}; 