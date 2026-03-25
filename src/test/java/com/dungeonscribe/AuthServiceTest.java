package com.dungeonscribe;

import com.dungeonscribe.entity.User;
import com.dungeonscribe.repository.UserRepository;
import com.dungeonscribe.security.JwtService;
import com.dungeonscribe.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_ShouldReturnToken_WhenValidInput(){

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123"))
                .thenReturn("hashedPassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken("test@test.com"))
                .thenReturn("mock.jwt.token");

        String token = authService.register("test@test.com", "testuser", "password123");

        assertThat(token).isEqualTo("mock.jwt.token");
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists(){

        User existingUser = new User();
        existingUser.setEmail("test@test.com");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(existingUser));

        assertThatThrownBy(() ->
            authService.register("test@test.com", "testuser", "password123"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email already registered");
    }

    @Test
    void login_ShouldReturnToken_WhenValidCredentials(){

        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("hashedpassword");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123","hashedpassword"))
                .thenReturn(true);
        when(jwtService.generateToken("test@test.com"))
                .thenReturn("mock.jwt.token");

        String token = authService.login("test@test.com", "password123");

        assertThat(token).isEqualTo("mock.jwt.token");
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound(){

        when(userRepository.findByEmail("nobody@test.com"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login("nobody@test.com","password123"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void login_ShouldThrowExcpetion_WhenInvalidPassword(){

        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("hashedpassword");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "hashedpassword"))
                .thenReturn(false);

        assertThatThrownBy(() -> authService.login("test@test.com", "wrongpassword"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid password");
    }
}
