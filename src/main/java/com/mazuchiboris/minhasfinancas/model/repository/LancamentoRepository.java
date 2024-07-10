package com.mazuchiboris.minhasfinancas.model.repository;

import com.mazuchiboris.minhasfinancas.model.entity.Lancamento;
import com.mazuchiboris.minhasfinancas.model.enums.StatusLancamento;
import com.mazuchiboris.minhasfinancas.model.enums.TipoLancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {
    @Query(value =
            " select sum(l.valor) from Lancamento l " +
                    " where l.usuario.id = :idUsuario and l.tipo = :tipo and l.status = :status")
    BigDecimal obterSaldoPorTipoLancamentoEUsuarioEStatus(
            @Param("idUsuario") Long idUsuario,
            @Param("tipo") TipoLancamento tipo,
            @Param("status")StatusLancamento status);
}
