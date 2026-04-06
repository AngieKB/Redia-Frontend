export interface Reservation {
    id: string;
    clienteEmail: string;
    clienteNombre?: string;
    fechaReserva: string;
    horaFinReserva: string;
    numeroPersonas: number;
    estado: string;
}

export interface CreateReservationRequest {
    fechaReserva: string;
    horaFinReserva: string;
    numeroPersonas: number;
    tableIds?: string[];
}

export interface TableAvailability {
    id: string;
    nombre: string;
    capacidad: number;
    disponible: boolean;
}

