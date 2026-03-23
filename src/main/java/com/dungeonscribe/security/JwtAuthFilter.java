package com.dungeonscribe.security;


import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        //1.Grab the Auth header
        String authHeader = request.getHeader("Authorization");

        //2. If there's no token, skip this filter
        if (authHeader == null || !authHeader.startsWith("Bearer")){
           filterChain.doFilter(request, response);
           return;
        }

        //3. Pull out token - Strip "Bearer"
        String token = authHeader.substring(7);

        //4. Validate and extract email
        if (!jwtService.isTokenValid(token)){
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtService.extractEmail(token);

        //5.Load the user from DB
        User user = userRepository.findByEmail(email).orElse(null);
        if(user == null){
            filterChain.doFilter(request,response);
            return;
        }

        //6. Tell Spring this is Authenticated
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        user, null, new ArrayList<>()
                );
        authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );
        SecurityContextHolder.getContext().setAuthentication(authToken);

        //7. Continue to next filter/controller
        filterChain.doFilter(request, response);
    }
}
