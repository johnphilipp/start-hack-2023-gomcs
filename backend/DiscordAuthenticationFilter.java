package eu.starthack.gomcsbackend.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;

public class DiscordAuthenticationFilter extends OncePerRequestFilter {
/*
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    private final String jwtSecret;

    public DiscordAuthenticationFilter(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws  IOException, ServletException {
        String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
            String idToken = authorizationHeader.substring(TOKEN_PREFIX.length());
            try {
                Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
                DecodedJWT jwt = JWT.require(algorithm).build().verify(idToken);

                // Create the authentication object
                AbstractAuthenticationToken authentication = createAuthentication(jwt);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JWTVerificationException e) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private AbstractAuthenticationToken createAuthentication(DecodedJWT jwt) {
        // Create your authentication object here based on the jwt content.
        // You can map the user claims to your custom UserDetails object or roles.
        // For this example, we're using a simple PreAuthenticatedAuthenticationToken.
        return new PreAuthenticatedAuthenticationToken(jwt.getSubject(), jwt.getToken());
    }
    */

}
