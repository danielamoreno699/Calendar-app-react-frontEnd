import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import calendarApi from "../../src/api/calendarApi"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store"
import {initialState, notAuthenticatedState} from "../fixtures/authStates"
import { testUserCredentials } from "../fixtures/testUser"


const getMockStore = (initialState) =>{
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: {...initialState}
            
        }
    })
}

describe('pruebas en authStore', () => {

    beforeEach(() => localStorage.clear())

    test('debe regresar los valores por defecto', () => {
        const mockStore = getMockStore({...initialState}) 

        const {result } = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        })

        //console.log(result.current)

        expect(result.current).toEqual({

            
                status: 'checking',
                user: {},
                errorMessage: undefined,
                startLogin: expect.any(Function),        
                startRegister: expect.any(Function),  
                checkAuthToken: expect.any(Function),
                startLogout: expect.any(Function),      
              

        })


    })
    test('startLogin debe de realizar el login correctamente', async() => {
        
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startLogin( testUserCredentials )
        });

        //console.log(result.current)

        const { errorMessage, status, user} = result.current

        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                uid: '63e7aeed96eae8091d365d6f',
                name: 'test user no borrar'
            }
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
    
    
 })

 test('startLogin debe falla la autenticacion', async() => { 
    

    const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

      

        await act(async() => {
            await result.current.startLogin( {email: 'algo@google.com', password: '123456789'} )
        });

        const { errorMessage, status, user} = result.current
        console.log({errorMessage, status, user})
       expect(localStorage.getItem('token')).toBe(null)
       expect({errorMessage, status, user}).toEqual({

        errorMessage: 'credenciales incorrectas',
        status: 'not-authenticated',
        user: {}

       })

      await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
       )

 })

 test('startregister debe crear usuario', async() => { 

    const newUser = {email: 'algo@google.com', password: '12345678', name:'test user 2'}

    const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "1233444",
                name: "test user no borrar",
                token: "xxxx"
            }
        })

        await act(async() => {
            await result.current.startRegister( newUser )
        });

        const {errorMessage, status, user} = result.current

        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {name: "test user no borrar", uid: "1233444"},
        })

        spy.mockRestore();

    
   })

   test('startregister debe fallar la creacion ', async() => { 

    

    const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

       

        await act(async() => {
            await result.current.startRegister( testUserCredentials)
        });

        const {errorMessage, status, user} = result.current

        expect({errorMessage, status, user}).toEqual({
            errorMessage: "un usuario ya existe con ese correo ",
            status: 'not-authenticated',
            user: {}
        })

       

    })

    test('checkAuthToken debe fallar si no hay token', async() => { 
        
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

       

        await act(async() => {
            await result.current.checkAuthToken( )
        });

        const {errorMessage, status, user} = result.current

        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user:{}
        })
    })

    test('checkAuthToken debe autenticar usuario si hay token', async() => { 

        const {data} = await calendarApi.post('/auth', testUserCredentials)
        localStorage.setItem('token', data.token)
        //console.log(data)

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

       

        await act(async() => {
            await result.current.checkAuthToken( )
        });

        const {errorMessage, status, user} = result.current

        console.log({errorMessage,status, user})

        expect({errorMessage, status, user}).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'test user no borrar', uid: '63e7aeed96eae8091d365d6f' }
        })
     })

})