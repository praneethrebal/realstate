package com.weekdays.properties.security;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
//

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.weekdays.properties.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

//@Service
//public class JwtService {
//
//    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
//
//    @Value("${jwt.secret}")
//    private String jwtSecret;
//
//    @Value("${jwt.expiration-ms}")
//    private long jwtExpirationMs;
//
//    private Key key;
//
//    @PostConstruct
//    public void init() {
//        byte[] keyBytes = jwtSecret.trim().getBytes(StandardCharsets.UTF_8);
//        if (keyBytes.length < 32) {
//            throw new IllegalArgumentException("JWT secret key must be at least 256 bits (32 bytes)");
//        }
//        key = Keys.hmacShaKeyFor(keyBytes);
//    }
//
//    // ----------------- Generate Token -----------------
//    public String generateToken(String username, Role role) {
//        Claims claims = Jwts.claims().setSubject(username);
//        claims.put("role", role.name()); // single role stored as String
//
//        Date now = new Date();
//        Date expiry = new Date(now.getTime() + jwtExpirationMs);
//
//        return Jwts.builder()
//                .setClaims(claims)
//                .setIssuedAt(now)
//                .setExpiration(expiry)
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    // ----------------- Extract Username -----------------
//    public String getUsernameFromToken(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(key)
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    // ----------------- Extract Role -----------------
//    public Role getRoleFromToken(String token) {
//        String roleStr = Jwts.parserBuilder()
//                .setSigningKey(key)
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .get("role", String.class);
//
//        return Role.valueOf(roleStr); // convert String back to Role enum
//    }
//
//    // ----------------- Validate Token -----------------
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
//            return true;
//        } catch (ExpiredJwtException ex) {
//            logger.error("JWT expired: {}", ex.getMessage());
//        } catch (UnsupportedJwtException ex) {
//            logger.error("Unsupported JWT: {}", ex.getMessage());
//        } catch (MalformedJwtException ex) {
//            logger.error("Malformed JWT: {}", ex.getMessage());
//        } catch (SignatureException ex) {
//            logger.error("Invalid JWT signature: {}", ex.getMessage());
//        } catch (IllegalArgumentException ex) {
//            logger.error("Illegal argument JWT: {}", ex.getMessage());
//        }
//        return false;
//    }
//}




@SuppressWarnings("deprecation")
@Service
public class JwtService {
	String key="";
	public JwtService()
	{
		KeyGenerator keyGenerator;
		try {
			keyGenerator=KeyGenerator.getInstance("HmacSHA256");
			SecretKey sk=keyGenerator.generateKey();
			key=Base64.getEncoder().encodeToString(sk.getEncoded());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}

	public String generateToken(User user) {
		Map<String, Object> claims=new HashMap<String, Object>();
		claims.put("role", user.getRole());
		   return Jwts.builder()
	                .setClaims(claims)
	                .setSubject(user.getUsername())
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*10)) // 10 hours
	                .signWith(getKey(), SignatureAlgorithm.HS256)
	                .compact();
	}
	private SecretKey getKey() {
		byte[] keyBytes=Decoders.BASE64.decode(key);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	
	
public String extractUsername(String token) {
		
		return extractClaim(token,Claims::getSubject);
	}
	private <T>T extractClaim(String token, Function<Claims, T> claimsResolver) {
		Claims claims=extractAllClaims(token);
		return claimsResolver.apply(claims);
	}
	private Claims extractAllClaims(String token) {
		
		return  Jwts.parser()
				.verifyWith(getKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();

	}
	public boolean validate(String token, UserDetails details) {
	    String username=extractUsername(token);
		return ((username.equals(details.getUsername())) && !isTokenExpried(token));
	}
	private boolean isTokenExpried(String token) {
		return extractExpration(token).before(new Date());
	}

	private Date extractExpration(String token) {

		return extractClaim(token,Claims::getExpiration);
	}


}

