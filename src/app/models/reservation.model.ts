export interface Reservation {
    id: string;
    clienteEmail: string;
    fechaReserva: string;
    horaFinReserva: string;
    numeroPersonas: number;
    estado: string;
}

export interface CreateReservationRequest {
    fechaReserva: string;
    horaFinReserva: string;
    numeroPersonas: number;
}
