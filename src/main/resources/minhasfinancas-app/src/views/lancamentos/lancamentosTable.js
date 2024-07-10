import React from "react";
import currencyFormarter from 'currency-formatter';

export default props => {

    const rows = props.lancamentos.map(lancamento => {
        return (
            <tr key={lancamento.id}>
                <td>{lancamento.descricao}</td>
                <td>{currencyFormarter.format(lancamento.valor, { locale: 'pt-BR' })}</td>
                <td>{lancamento.tipo}</td>
                <td>{lancamento.mes}</td>
                <td>{lancamento.status}</td>
                <td>
                    <button className="btn btn-success"
                        onClick={e => props.alterarStatus(lancamento, 'EFETIVADO')}
                        type="button">
                        <i class="pi pi-check"></i>
                    </button>
                    <button className="btn btn-warning"
                        onClick={e => props.alterarStatus(lancamento, 'CANCELADO')}
                        type="button">
                        <i class="pi pi-times"></i>
                    </button>
                    <button type="button"
                        className="btn btn-primary"
                        onClick={e => props.editAction(lancamento.id)}>
                        <i class="pi pi-pencil"></i>
                    </button>
                    <button type="button"
                        className="btn btn-danger"
                        onClick={e => props.deleteAction(lancamento)}>
                        <i class="pi pi-trash"></i>
                    </button>
                </td>
            </tr>
        )
    })

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}