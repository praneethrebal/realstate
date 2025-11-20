package com.weekdays.properties.security;


import com.weekdays.properties.enums.Role;
import com.weekdays.properties.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
   
    private final ApplicationContext context;
    @Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
    	String path = request.getServletPath();
    	 if (path.startsWith("/login") || path.startsWith("/register") ||
    	            path.startsWith("/free-access") || path.startsWith("/error") || path.startsWith("/otp")||path.startsWith("lottery/getAlllottry")) {
    	            filterChain.doFilter(request, response);
    	            return;
    	        }
		String authHeader=request.getHeader("Authorization");
		String username=null;
		String token=null;
		if(authHeader != null && authHeader.startsWith("Bearer "))
		{
			token=authHeader.substring(7);
			username=jwtService.extractUsername(token);
		}
		if(username != null && SecurityContextHolder.getContext().getAuthentication()==null)
		{
			UserDetails details=context.getBean(CustomUserDetailsService.class).loadUserByUsername(username);
			if(jwtService.validate(token,details))
			{
				UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(details,null,details.getAuthorities());
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}
		filterChain.doFilter(request, response);
	
		
	}

//    @Override
//	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//			throws ServletException, IOException {
//    	   String path = request.getServletPath();
//    	 if (path.startsWith("/login")|| path.startsWith("/free-acess") ) {  
//             filterChain.doFilter(request, response);
//             return;
//         }
//		String authHeader=request.getHeader("Authorization");
//		String username=null;
//		String token=null;
//		if(authHeader != null && authHeader.startsWith("Bearer "))
//		{
//			token=authHeader.substring(7);
//			username=jwtService.extractUsername(token);
//		}
//		if(username != null && SecurityContextHolder.getContext().getAuthentication()==null)
//		{
//			UserDetails details=context.getBean(CustomUserDetailsService.class).loadUserByUsername(username);
//			if(jwtService.validate(token,details))
//			{
//				UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(details,null,details.getAuthorities());
//				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//				SecurityContextHolder.getContext().setAuthentication(authToken);
//			}
//		}
//		filterChain.doFilter(request, response);
//	}
}
