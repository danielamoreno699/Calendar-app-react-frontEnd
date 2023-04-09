import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState } from "../../fixtures/authStates"
import { testUserCredentials } from "../../fixtures/testUser"

describe('pruebas en authslice', () => { 

    test('debe regresar el estado inicial', () => { 
        expect(authSlice.getInitialState()).toEqual(initialState)
     })

     test('debe realizar login', () => { 

        const state = authSlice.reducer(initialState, onLogin(testUserCredentials))
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })
        console.log(state)
      })

      test('debe realizar logout', () => { 
        const state = authSlice.reducer(authenticatedState, onLogout())
     
        expect(state).toEqual({
            status: 'not-authenticated',
            user:{},
            errorMessage: undefined
        })
      })

      test('debe realizar logout', () => { 
        const errorMessage = 'credenciales no validas'
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage))
        expect(state).toEqual({
            status: 'not-authenticated',
            user:{},
            errorMessage: errorMessage
        })
      })

      test('debe limpiar el mensaje de error', () => { 
        const errorMessage = 'credenciales no validas'
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage))
        const newState = authSlice.reducer(state, clearErrorMessage())

        expect(newState.errorMessage).toBe(undefined)
       })
 })