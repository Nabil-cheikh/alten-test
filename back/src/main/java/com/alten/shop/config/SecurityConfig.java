package com.alten.shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.alten.shop.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(cors -> {})
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
              // Routes publiques
              .requestMatchers("/account", "/token").permitAll()
              .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/v3/api-docs.yaml", "/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()
              .requestMatchers("/h2-console/**").permitAll()
              // GET products accessible à tous
              .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
              // POST/PATCH/DELETE products réservés à admin
              .requestMatchers(HttpMethod.POST, "/api/products/**").authenticated()
              .requestMatchers(HttpMethod.PATCH, "/api/products/**").authenticated()
              .requestMatchers(HttpMethod.DELETE, "/api/products/**").authenticated()
              // Cart et Wishlist nécessitent authentification
              .requestMatchers("/api/cart/**", "/api/wishlist/**").authenticated()
              .anyRequest().authenticated()
      )
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
      .headers(headers -> headers.frameOptions(frame -> frame.disable()));

    return http.build();
  }

}
