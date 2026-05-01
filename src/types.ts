export interface PagoMovilTransaction {
    ID: string;
    created_at: string;
    update_at: string;
    deleted_at: string | null;
    Dni: string;
    PhoneDest: string;
    PhoneOrig: string;
    Amount: number;
    BancoOrig: string;
    NroReferenciaCorto: string;
    NroReferencia: string;
    HoraMovimiento: string;
    FechaMovimiento: string;
    Descripcion: string;
    Status: string;
    Refpk: string;
    Ref: number;
}

export interface ConsultaPagoRequest {
    Phone: number;
    Bank: string;
    Date: Date;
}

export interface ConsultaPagoResponse {
    code: number;
    lista: PagoMovilTransaction[];
    mod: string;
    num: number;
}

export interface RefreshPasswordRequest {
    Dni: string;
    Pass: string;
    PassNew: string;
}

export interface RefreshPasswordResponse {
    code: number;
    mensaje: string;
    mod: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    code: number;
    expireDate: number;
    mensaje: string;
    mod: string;
    refresToken: string;
    token: string;
}