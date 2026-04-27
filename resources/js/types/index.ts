export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Auth {
    user: User | null;
}

export interface Flash {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}

export interface AppNotification {
    id: string;
    type: 'client' | 'sale' | 'appointment';
    title: string;
    message: string;
    href: string;
    created_at: string;
    is_new: boolean;
}

export interface PageProps {
    auth: Auth;
    flash: Flash;
    notifications: AppNotification[];
    [key: string]: unknown;
}

export interface Agent {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    gender?: string;
    email: string;
    contact_number?: string;
    agent_phone_num?: string;
    agent_landline?: string;
    referral_code?: string;
    appointment_ref_code?: string;
    is_institution: boolean;
    address: Address;
    pag_ibig_id?: string;
    tin?: string;
    created_at: string;
    updated_at: string;
}

export interface Address {
    country?: string;
    region?: string;
    province?: string;
    city?: string;
    barangay?: string;
    street?: string;
    zip_code?: string;
}

export interface Client {
    id: number;
    agent_id: number;
    buyer_type: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    gender?: string;
    civil_status?: string;
    birth_date?: string;
    birth_place?: string;
    nationality?: string;
    email: string;
    contact_number?: string;
    present_address?: string;
    permanent_address?: string;
    tin?: string;
    pag_ibig_id?: string;
    sss_no?: string;
    occupation?: string;
    employer?: string;
    monthly_income?: number;
    source_of_income?: string;
    created_at: string;
    updated_at: string;
}

export interface Sale {
    id: number;
    agent_id: number;
    buyer_id: number;
    project_id: number;
    unit_id: number;
    status: string;
    reservation: {
        date?: string;
        fee?: number;
        promo_code?: string;
    };
    pricing: {
        tcp?: number;
        tcp_vat?: number;
        discount?: number;
        dp_percentage?: number;
        dp_amount?: number;
        total_paid?: number;
        balance?: number;
    };
    equity: {
        has_equity: boolean;
        equity_net?: number;
        equity_terms?: number;
        monthly_equity?: number;
        start_date?: string;
        end_date?: string;
    };
    financing: {
        type?: string;
        bank?: string;
        amount?: number;
    };
    buyer?: Client;
    created_at: string;
    updated_at: string;
}

export interface Incentive {
    id: number;
    agent_id: number;
    sale_id: number;
    client_name?: string;
    unit_id: number;
    status: string;
    unit?: {
        unit_number: string;
        block_number?: string;
        floor?: string | number;
        building?: string;
        project?: {
            name: string;
        };
    };
    created_at: string;
    updated_at: string;
}

export interface Appointment {
    id: number;
    client_fname: string;
    client_lname: string;
    client_email?: string;
    client_contact_number?: string;
    seller_name?: string;
    appointment_date: string | null;
    appointment_time?: string;
    status: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface NavItem {
    title: string;
    href: string;
    icon: string;
}
