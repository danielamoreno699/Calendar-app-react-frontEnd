import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { CalendarPage } from "../../src/calendar"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { AppRouter } from "../../src/router/AppRouter"

jest.mock("../../src/hooks/useAuthStore")

jest.mock("../../src/calendar", ()=> ({
    CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('pruebas en appRouter', () => { 

    const mockCheckAuthToken = jest.fn()

    beforeEach(()=> jest.clearAllMocks())

test('debe mostrar pantallade cargar y llamar checkAauthToken', ()=>{

    useAuthStore.mockReturnValue({
        status: 'checking',
        checkAuthToken: mockCheckAuthToken
    })

    render(<AppRouter/>)

    screen.debug()
    expect(screen.getByText('cargando ...')).toBeTruthy()
    expect(mockCheckAuthToken).toHaveBeenCalled()

})

test('debe mostrar el login en caso de no estar autenticado', ()=>{

    useAuthStore.mockReturnValue({
        status: 'not-authenticated',
        checkAuthToken: mockCheckAuthToken
    })

    const {container} = render(

        <MemoryRouter initialEntries={['/auth/ingreso']}>
            <AppRouter/>
        </MemoryRouter>
    
    
    
    )

    expect(screen.getByText('Ingreso')).toBeTruthy()
    expect(container).toMatchSnapshot()

    

})

test('debe mostrar el calendario si estamos autenticados', ()=>{

    useAuthStore.mockReturnValue({
        status: 'authenticated',
        checkAuthToken: mockCheckAuthToken
    })

    const {container} = render(

        <MemoryRouter >
            <AppRouter/>
        </MemoryRouter>
   
    )
    expect(screen.getByText('CalendarPage')).toBeTruthy()
})

    
 })