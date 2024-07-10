package com.mazuchiboris.minhasfinancas.api.resource;

import com.mazuchiboris.minhasfinancas.api.dto.AtualizaStatusDto;
import com.mazuchiboris.minhasfinancas.api.dto.LancamentoDTO;
import com.mazuchiboris.minhasfinancas.exception.RegraNegocioException;
import com.mazuchiboris.minhasfinancas.model.entity.Lancamento;
import com.mazuchiboris.minhasfinancas.model.entity.Usuario;
import com.mazuchiboris.minhasfinancas.model.enums.StatusLancamento;
import com.mazuchiboris.minhasfinancas.model.enums.TipoLancamento;
import com.mazuchiboris.minhasfinancas.service.LancamentoService;
import com.mazuchiboris.minhasfinancas.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lancamentos")
@RequiredArgsConstructor
public class LancamentoResource {

    @Autowired
    private LancamentoService service;
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity buscar(
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam(value = "mes", required = false) Integer mes,
            @RequestParam(value = "ano", required = false) Integer ano,
            @RequestParam("usuario") Long idUsuario
            ){
        Lancamento lancamentoFiltro = new Lancamento();
        lancamentoFiltro.setDescricao(descricao);
        lancamentoFiltro.setMes(mes);
        lancamentoFiltro.setAno(ano);

       Optional<Usuario> usuario = usuarioService.obterporId(idUsuario);
       if(!usuario.isPresent()){
           return ResponseEntity.badRequest().body("Não foi possivel realizar a consulta. Usuario não encontrado para o id encontrado");
       }else {
           lancamentoFiltro.setUsuario(usuario.get());
       }
       List<Lancamento> lancamentos = service.buscar(lancamentoFiltro);
       return ResponseEntity.ok(lancamentos);
    }
@GetMapping("{id}")
@CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity obterLancamento(@PathVariable("id")Long id){
        return service.obterPorId(id)
                .map(lancamento -> new ResponseEntity(converter(lancamento), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity(HttpStatus.NOT_FOUND));
    }
    @PostMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity salvar(@RequestBody LancamentoDTO dto) {
        try {
            Lancamento entidade = converter(dto);
            entidade = service.salvar(entidade);
            return new ResponseEntity(entidade, HttpStatus.CREATED);
        } catch (RegraNegocioException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity atualizar(@PathVariable("id") Long id, @RequestBody LancamentoDTO dto) {
        return service.obterPorId(id).map(entity -> {
            try {
                Lancamento lancamento = converter(dto);
                lancamento.setId(entity.getId());
                service.atualizar(lancamento);
                return ResponseEntity.ok(lancamento);
            } catch (RegraNegocioException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }).orElseGet(() ->
                new ResponseEntity("Lancamento não encontrado na base de Dados", HttpStatus.BAD_REQUEST));
    }
    @PutMapping("{id}/atualiza-status")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity atulizarStatus(@PathVariable("id") Long id, @RequestBody AtualizaStatusDto dto) {
        return service.obterPorId(id).map(entity -> {
            StatusLancamento statusSelecionado = StatusLancamento.valueOf(dto.getStatus());
            if (statusSelecionado == null) {
                return ResponseEntity.badRequest().body("Não foi possivel atualizar o status do lançamento, envie um status valido");
            }
            try {
                entity.setStatus(statusSelecionado);
                service.atualizar(entity);
                return ResponseEntity.ok(entity);
            } catch (RegraNegocioException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }).orElseGet(() ->
                new ResponseEntity("Lancamento não encontrado na base de Dados", HttpStatus.BAD_REQUEST));
    }
@DeleteMapping("{id}")
@CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity deletar (@PathVariable("id") Long id){
        return service.obterPorId(id).map( entidade ->{
            service.deletar(entidade);
            return new ResponseEntity(HttpStatus.NO_CONTENT);
        }).orElseGet(() ->
                new ResponseEntity("Lancamento não encontrado na base de Dados", HttpStatus.BAD_REQUEST));
}

private  LancamentoDTO converter(Lancamento lancamento){
    return LancamentoDTO.builder()
            .id(lancamento.getId())
            .descricao(lancamento.getDescricao())
            .valor(lancamento.getValor())
            .mes(lancamento.getMes())
            .ano(lancamento.getAno())
            .status(lancamento.getStatus().name())
            .tipo(lancamento.getTipo().name())
            .usuario(lancamento.getUsuario().getId())
            .build();

}

    private Lancamento converter(LancamentoDTO dto) {
        Lancamento lancamento = new Lancamento();
        lancamento.setId(dto.getId());
        lancamento.setAno(dto.getAno());
        lancamento.setDescricao(dto.getDescricao());
        lancamento.setMes(dto.getMes());
        lancamento.setValor(dto.getValor());

        Usuario usuario = usuarioService.obterporId(dto.getUsuario())
                .orElseThrow(() -> new RegraNegocioException
                        ("Usuario não encontrado para o id encontrado"));

        lancamento.setUsuario(usuario);
        if(dto.getTipo() != null) {
            lancamento.setTipo(TipoLancamento.valueOf(dto.getTipo()));
        }
        if(lancamento.getStatus() == null) {
            lancamento.setStatus(StatusLancamento.PENDENTE);
        }
        return lancamento;
    }

}
