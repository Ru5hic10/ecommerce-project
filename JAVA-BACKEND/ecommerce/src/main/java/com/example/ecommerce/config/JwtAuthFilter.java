package com.example.ecommerce.config;

import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtil.validateTokenAndGetEmail(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    com.example.ecommerce.model.User dbUser = userRepository.findByEmail(email).orElse(null);

                    if (dbUser != null) {
                        List<SimpleGrantedAuthority> authorities = dbUser.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                                .collect(Collectors.toList());

                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        new org.springframework.security.core.userdetails.User(
                                                email, "", authorities),
                                        null,
                                        authorities
                                );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        System.out.println("Authorities for user " + email + ":");
                        authorities.forEach(auth -> System.out.println(" - " + auth.getAuthority()));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); // Optional: log error
        }

        // 🔥 Always do this, no matter what
        filterChain.doFilter(request, response);
    }
}

