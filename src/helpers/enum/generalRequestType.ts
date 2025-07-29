import { GeneralSupportRequestType } from "@/constants/enums/GeneralRequestType";

export const getGeneralRequestTypeTitle = (type: GeneralSupportRequestType): string => {
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
    return [
        { value: GeneralSupportRequestType.Other, title: "Diğer" },
        { value: GeneralSupportRequestType.TechnicalSupport, title: "Teknik Destek" },
        { value: GeneralSupportRequestType.Feedback, title: "Geri Bildirim" },
        { value: GeneralSupportRequestType.AccountHelp, title: "Hesap Yardımı" },
    ];
}; 