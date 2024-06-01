package lk.ijse.gdse66.helloshoes.backend.service;

import lk.ijse.gdse66.helloshoes.backend.auth.request.SignInRequest;
import lk.ijse.gdse66.helloshoes.backend.auth.request.SignUpRequest;
import lk.ijse.gdse66.helloshoes.backend.auth.response.JWTAuthResponse;

/**
 * @author: Theekshana De Silva,
 * @Runtime version: 11.0.11+9-b1341.60amd64
 **/

public interface AuthenticationService {
    JWTAuthResponse signIn(SignInRequest signInRequest);
    JWTAuthResponse signUp(SignUpRequest signUpRequest);
    JWTAuthResponse updateaccount(SignUpRequest signUpRequest);
}
