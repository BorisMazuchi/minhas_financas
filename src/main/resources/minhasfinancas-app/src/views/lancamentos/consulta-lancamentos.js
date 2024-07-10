import React from "react";
import { withRouter } from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from "../../components/form-group";
import SelectMenu from "../selectMenu";
import LancamentosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localStorageService";


import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button'


import * as messages from '../../components/toastr';

class ConsultaLancamentos extends React.Component {
    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório');
            return false;
        }
        const usuarioLogado = LocalStorageService.obterItem("_usuario_logado");

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        };

        this.service
            .consultar(lancamentoFiltro)
            .then(res => {
                const lista = res.data;
                if(lista.length < 1){
                    messages.mensagemAlert("Nenhum resultado encontrado");
                }
                this.setState({ lancamentos: lista});
            })
            .catch(error => {
                console.log(error);
            });
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, lancamentoDeletar: {} })

    }

    deletar = () => {
        this.service.deletar(this.state.lancamentoDeletar.id)
            .then(res => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar)
                lancamentos.splice(index, 1);
                this.setState({lancamentos: lancamentos, showConfirmDialog: false})
                messages.mensagemSucesso("Lançamento deletado com sucesso!");
            }).catch(error => {
                messages.mensagemErro("Ocorreu um erro ao tentar deletar o Lançamento");
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos');
    }

    alterarStatus = (Lancamento, status) =>  {
        this.service
        .alterarStatus(Lancamento.id, status)
        .then( response => {
            const lancamentos = this.state.lancamentos;

            const index = lancamentos.indexOf(Lancamento)
            if(index !== -1){
                Lancamento['status'] = status;
                lancamentos[index] = Lancamento;
                this.setState({Lancamento});
            }
            messages.mensagemSucesso("Status atualizado com sucesso!")
        })
    }

    render() {

        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirma" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} className="p-button-secondary" />
            </div>
        );

        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input type="text"
                                    className="form-control"
                                    id="inputAno"
                                    value={this.state.ano}
                                    onChange={e => this.setState({ ano: e.target.value })}
                                    placeholder="Digite o Ano" />
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelectMenu id="inputMes"
                                    value={this.state.mes}
                                    onChange={e => this.setState({ mes: e.target.value })}
                                    className="form-control"
                                    lista={meses} />
                            </FormGroup>
                            <FormGroup htmlFor="inputDesc" label="Descrição: ">
                                <input type="text"
                                    className="form-control"
                                    id="inputDesc"
                                    value={this.state.descricao}
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                    placeholder="Digite a descrição:" />
                            </FormGroup>
                            <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: ">
                                <SelectMenu id="inputTipo"
                                    value={this.state.tipo}
                                    onChange={e => this.setState({ tipo: e.target.value })}
                                    className="form-control"
                                    lista={tipos} />
                            </FormGroup>
                            <br />
                            <button onClick={this.buscar} type="button" className="btn btn-success">
                                <i className="pi pi-search"></i>Buscar</button>
                            <button onClick={this.preparaFormularioCadastro} type="button" className="btn btn-danger">
                                <i className="pi pi-plus"></i>Cadastrar</button>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <LancamentosTable lancamentos={this.state.lancamentos}
                            deleteAction={this.abrirConfirmacao}
                            editAction={this.editar} 
                            alterarStatus={this.alterarStatus}/>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação"
                        visible={this.state.showConfirmDialog}
                        style={{ width: '50vw' }}
                        modal={true}
                        footer={confirmDialogFooter}
                        onHide={() => this.setState({ showConfirmDialog: false })}>
                        <p className="m-0">
                            Confirma a exclusão deste lançamento ?
                        </p>
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos);