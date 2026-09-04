
enum Difficult{
    LOW ='LOW',
    MEDIUM='MEDIUM',
    HIGH='HIGH'
}

export interface TicketDiagnosisResponse{

    possibleCauses: string[];
    diagnosticSteps: string[];
    recommendedSolutions: string[];
    difficult: Difficult;

}