package com.weekdays.properties.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.weekdays.properties.dto.ContactUsFormDto;
import com.weekdays.properties.entity.ConstructionFormModel;
import com.weekdays.properties.entity.ContactUsForm;
import com.weekdays.properties.entity.EmiCalculatorModel;
import com.weekdays.properties.entity.FranchiseFormModel;
import com.weekdays.properties.entity.FutureRequirementsFormModel;
import com.weekdays.properties.entity.LoanApplicationFormModel;
import com.weekdays.properties.entity.PackersAndMoversFormModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.service.ConstructionFormService;
import com.weekdays.properties.service.ContactUsFormService;
import com.weekdays.properties.service.EmiCalculatorService;
import com.weekdays.properties.service.FranchiseFormService;
import com.weekdays.properties.service.FutureRequirementsFormService;
import com.weekdays.properties.service.LoanApplicationFormService;
import com.weekdays.properties.service.PackersAndMoversFormService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/forms")
@CrossOrigin()
@RequiredArgsConstructor
public class FormController {
	
	@Autowired
	private ConstructionFormService constructionFormService;
	
	@Autowired
	private FranchiseFormService    franchiseFormService;
	
	@Autowired
	private FutureRequirementsFormService futureRequirementsFormService;
	
	@Autowired
	private LoanApplicationFormService loanApplicationFormService;
	
	@Autowired
	private PackersAndMoversFormService packersAndMoversFormService;
	
	@Autowired
	private EmiCalculatorService emiCalculatorService;
	
	private final ContactUsFormService contactUsFormService;
	
	                                      //CONSTRUCTION FORM
	@PostMapping("/ConstructionForm")
	public ResponseEntity<ConstructionFormModel> constructionForm(@RequestBody ConstructionFormModel request){
		ConstructionFormModel constructionForm = constructionFormService.createConstructionFormModel(request);
		return ResponseEntity.ok(constructionForm);
	}
	
	@GetMapping("/ConstructionForm")
	public List<ConstructionFormModel>getAllConstructionForms(){
		return constructionFormService.getAllConstructionForms();
	}
	
	@GetMapping("/ConstructionForm/{id}")
	public ResponseEntity<ConstructionFormModel> getConstructionFormById(@PathVariable Long id){
		ConstructionFormModel constructionForm = constructionFormService.getconstructionFormById(id);
		return ResponseEntity.ok(constructionForm);
	}
	
	
	                                   //FRANCHISE FORM
	//FRANCHISE FORM
    @PostMapping("/FranchiseForm")
    public ResponseEntity<FranchiseFormModel> franchiseForm(@RequestBody FranchiseFormModel request){
        FranchiseFormModel franchiseForm = franchiseFormService.CreateFranchiseFormModel(request);
        return ResponseEntity.ok(franchiseForm);
    }

    @GetMapping("/FranchiseForm")
    public List<User>getAllFranchiseForms(){
        return franchiseFormService.getAllFranchiseForms();
    }

    @GetMapping("/FranchiseForm/{id}")
    public ResponseEntity<FranchiseFormModel> getFranchiseFormById(@PathVariable Long id){
        FranchiseFormModel franchiseForm = franchiseFormService.getAllFranchiseFromsById(id);
        return ResponseEntity.ok(franchiseForm);
    }

    @GetMapping("/FranchiseUsers")
    public ResponseEntity<List<User>> getAllFranchiseUsers() {
        List<User> users = franchiseFormService.getAllFranchiseUsers();
        return ResponseEntity.ok(users);
    }
	
	
	                                         //FUTUREREQUIREMENTS FORM
	@PostMapping("/FutureRequirementsForm")
	public ResponseEntity<FutureRequirementsFormModel> futureRequirementsForm(@RequestBody FutureRequirementsFormModel request){
		FutureRequirementsFormModel futureRequirementsForm = futureRequirementsFormService.createFutureRequirementsFormModel(request);
		return ResponseEntity.ok(futureRequirementsForm);
	}
	
	@GetMapping("/FutureRequirementsForm")
	public List<FutureRequirementsFormModel>getAllFutureRequirementsForms(){
		return futureRequirementsFormService.getAllFutureRequirementsForms();
	}
	
	@GetMapping("/FutureRequirementsForm/{id}")
	public ResponseEntity<FutureRequirementsFormModel> getFutureRequirementsFormById(@PathVariable long id){
		FutureRequirementsFormModel futureRequirementForm = futureRequirementsFormService.getAllFutureRequirementsFormsById(id);
		return ResponseEntity.ok(futureRequirementForm);
	}
	
	
	                                      //LOANAPPLICATION  FORM
	@PostMapping("/LoanApplicationForm") 
	public ResponseEntity<LoanApplicationFormModel> loanApplicationForm(@RequestBody LoanApplicationFormModel request){
		LoanApplicationFormModel loanApplicationForm = loanApplicationFormService.createLoanApplicationForm(request);
		return ResponseEntity.ok(loanApplicationForm);
	}
	
	
	@GetMapping("/LoanApplicationForm")
	public List<LoanApplicationFormModel>getAllLoanApplicationForms(){
		return loanApplicationFormService.getAllLoanApplicationForm();
	}
	
	
	@GetMapping("/LoanApplicationForm/{id}")
	public ResponseEntity<LoanApplicationFormModel> getLoanApplicationFormById(@PathVariable Long id){
		LoanApplicationFormModel loanApplicationForm = loanApplicationFormService.getAllLoanApplicationFormById(id);
		return ResponseEntity.ok(loanApplicationForm);
	}
	
	
	                                        //PACKERSANDMOVERS FORM
	@PostMapping("/PackersAndMoversForm")
	public ResponseEntity<PackersAndMoversFormModel> packersAndMoversForm(@RequestBody PackersAndMoversFormModel request){
	    PackersAndMoversFormModel  packersAndMoversForm = packersAndMoversFormService.CreatePackersAndMoversFormModel(request);
	    return ResponseEntity.ok(packersAndMoversForm);   
	}
	
	
	@GetMapping("/PackersAndMoversForm")
	public List<PackersAndMoversFormModel>getAllPackersAndMoversForms(){
		return packersAndMoversFormService.getPackersAndMoversFormModel();
	}
	
	@GetMapping("/PackersAndMoversForm/{id}")
	public ResponseEntity<PackersAndMoversFormModel> getpackersAndMoversFormById(@PathVariable Long id){
		PackersAndMoversFormModel packersAndmoversForm = packersAndMoversFormService.getPackersAndMoversFormModelById(id);
		return ResponseEntity.ok(packersAndmoversForm);
	}
	
	//@PostMapping("/EmiCalculator")
	//public void emicalculator(@RequestBody EmiCalculatorModel create) {
	//	emiCalculatorService.createEmiCalculator(create);
	//}
	
	@GetMapping("/emiAmount/{totalAmount}/{rateOfInterest}/{month}")
	public double getemiAmount(@PathVariable double totalAmount,@PathVariable double rateOfInterest,@PathVariable Long month){
		
		return emiCalculatorService.emiAmount(totalAmount, rateOfInterest, month);
	}
	
	//Contact Us Form
    @PostMapping("/ContactUsForm")
    public ResponseEntity<ContactUsForm> contactUsForm(@RequestBody ContactUsFormDto request){
        ContactUsForm contactUsForm = contactUsFormService.createContactUsForm(request);
        return ResponseEntity.ok(contactUsForm);
    }
}	
	
 