export async function api() {

    const url = 'http://localhost:3000/coffee'; // get padrao
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Falha ao buscar cafés:", error);
        return []; // retorna um array vazio se der erro
    }
}