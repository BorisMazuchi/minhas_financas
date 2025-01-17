package com.mazuchiboris.minhasfinancas.service;

import com.mazuchiboris.minhasfinancas.model.entity.Usuario;

import java.util.Optional;

public interface UsuarioService {

    Usuario autenticar(String email, String senha);

    Usuario salvarUsuario(Usuario usuario);

    void validarEmail(String email);

    Optional<Usuario> obterporId(Long id);
}
