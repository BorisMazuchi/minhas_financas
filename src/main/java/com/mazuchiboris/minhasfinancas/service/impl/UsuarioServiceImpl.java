package com.mazuchiboris.minhasfinancas.service.impl;

import com.mazuchiboris.minhasfinancas.exception.ErroAutenticacao;
import com.mazuchiboris.minhasfinancas.exception.RegraNegocioException;
import com.mazuchiboris.minhasfinancas.model.entity.Usuario;
import com.mazuchiboris.minhasfinancas.model.repository.UsuarioRepository;
import com.mazuchiboris.minhasfinancas.service.UsuarioService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private UsuarioRepository repository;
    public UsuarioServiceImpl(UsuarioRepository repository) {
        this.repository = repository;
    }
    @Override
    public Usuario autenticar(String email, String senha) {
        Optional<Usuario> usuario = repository.findByEmail(email);

        if (!usuario.isPresent()) {
            throw new ErroAutenticacao("Usuário não encontrado para o email: " + email);
        }
        if (!usuario.get().getSenha().equals(senha)) {
            throw new ErroAutenticacao("Senha inválida");
        }
        return usuario.get();
    }

    @Override
    @Transactional
    public Usuario salvarUsuario(Usuario usuario) {
        validarEmail(usuario.getEmail());
        return repository.save(usuario);
    }

    @Override
    public void validarEmail(String email) {
        boolean existe = repository.existsByEmail(email);
        if(existe){
            throw new RegraNegocioException("Ja existe um usuario cadastrado com este email");
        }
    }

    @Override
    public Optional<Usuario> obterporId(Long id) {
        return repository.findById(id);
    }
}
