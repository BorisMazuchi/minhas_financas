import ApiService from "../apiService";
import ErroValidacao from "../execption/ErroValidacao";

export default class LancamentoService extends ApiService {
    constructor() {
        super('/api/lancamentos');
    }

    obterListaMeses() {
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Janeiro', value: '1' },
            { label: 'Fevereiro', value: '2' },
            { label: 'Março', value: '3' },
            { label: 'Abril', value: '4' },
            { label: 'Maio', value: '5' },
            { label: 'Junho', value: '6' },
            { label: 'Julho', value: '7' },
            { label: 'Agosto', value: '8' },
            { label: 'Setembro', value: '9' },
            { label: 'Outubro', value: '10' },
            { label: 'Novembro', value: '11' },
            { label: 'Dezembro', value: '12' },
        ]
    }

    obterListaTipos() {
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Despesa', value: 'DESPESA' },
            { label: 'Receita', value: 'RECEITA' }
        ]
    }

    obterPorId(id){
        return this.get(`/${id}`)
    }

    alterarStatus(id, status){ 
        return this.put(`/${id}/atualiza-status`, {status})
    }

    validar(lancamento){
        const erros = [];

        if(!lancamento.ano){
            erros.push("Informe o Ano.")
        }
        
        if(!lancamento.mes){
            erros.push("Informe o Mês.")
        }

        if(!lancamento.descricao){
            erros.push("Informe o Descrição.")
        }

        if(!lancamento.valor){
            erros.push("Informe o Valor.")
        }

        if(!lancamento.tipo){
            erros.push("Informe o Tipo.")
        }

        if (erros && erros.length > 0){
            throw new ErroValidacao(erros);
        }

    }

    salvar(lancamento){
        return this.post('', lancamento);
    }

    atualizar(lancamento) {
        const { id, ...data } = lancamento;
        return this.put(`/${id}`, data);
    }

    consultar(lancamentoFiltro) {
        let paramns = `?ano=${lancamentoFiltro.ano}`;

        if (lancamentoFiltro.mes) {
            paramns = `${paramns}&mes=${lancamentoFiltro.mes}`;
        }

        if (lancamentoFiltro.tipo) {
            paramns = `${paramns}&tipo=${lancamentoFiltro.tipo}`;
        }

        if (lancamentoFiltro.status) {
            paramns = `${paramns}&status=${lancamentoFiltro.status}`;
        }

        if (lancamentoFiltro.usuario) {
            paramns = `${paramns}&usuario=${lancamentoFiltro.usuario}`;
        }

        if (lancamentoFiltro.descricao) {
            paramns = `${paramns}&descricao=${lancamentoFiltro.descricao}`;
        }
        return this.get(paramns);
    }

    deletar(id){
        return this.delete(`/${id}`)
    }
}
