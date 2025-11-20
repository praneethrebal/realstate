//package com.weekdays.properties.service;
//
//import org.json.JSONObject;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import com.razorpay.Order;
//import com.razorpay.RazorpayClient;
//import com.razorpay.RazorpayException;
//
//@Service
//public class PaymentService {
//	@Value("${razorpay.key.id}")
//    private String keyId;
//
//    @Value("${razorpay.key.secret}")
//    private String keySecret;
//    
//    
//    public String createOrder(double price,String receipt) throws RazorpayException {
//    	RazorpayClient client=new RazorpayClient(keyId, keySecret);
//    	JSONObject orderRequest=new JSONObject();
//    	orderRequest.put("amount", price * 100);  // amount in paise
//        orderRequest.put("currency", "INR");
//        orderRequest.put("receipt", receipt);
//        Order order=client.orders.create(orderRequest);
//        
//    	return order.toString();
//    }
//    public boolean verifyPayment(String orderId,String paymentId, String signature) {
//    	  String generatedSignature = org.apache.commons.codec.digest.HmacUtils.hmacSha256Hex(
//                  keySecret, orderId + "|" + paymentId);
//          return generatedSignature.equals(signature);
//    	
//    }
//    
//    
//}
