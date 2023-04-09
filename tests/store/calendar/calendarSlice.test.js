import {calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent} from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventsState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('pruebas en calendarSlice', () => { 
    test('debe regresar el estado por defecto', () => { 
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState)
     })

     test('onSetActiveEvent debe activar el evento ', () => { 

        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]))
        expect(state.activeEvent).toEqual(events[0])
      })

      test('onAddnew event debe agregar evento', () => { 

        const newEvent = 
        {

            id: '3',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
            title: 'cumpleaños de esposin',
            notes: 'hay que comprar pastel',
            
    }
            const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent))

            expect(state.events).toEqual([...events, newEvent])


      })


      
      test('onUpdateEvent  debe actualizar evento', () => { 

        const updatedEvent = 
        {

            id: '1',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
            title: 'cumpleaños de esposin actualizado',
            notes: 'nota actualizada',
            
    }
            const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent))

            expect(state.events).toContain(updatedEvent)


      })

      test('debe borrar el evento activo', () => { 
        const state = calendarSlice.reducer(calendarWithActiveEventsState, onDeleteEvent())
        expect(state.activeEvent).toBe(null)
        expect(state.events).not.toContain(events[0])

       })

       test('onload events debe establecer eventos', () => { 
        const state = calendarSlice.reducer(initialState, onLoadEvents(events))
        expect(state.isLoadingEvents).toBeFalsy()
        expect(state.events).toEqual(events)

        const newState = calendarSlice.reducer(initialState, onLoadEvents(events))
        expect(state.events.length).toBe(events.length)
        
       })

       test('onlogout debe limipar el estado ', () => { 

        const state = calendarSlice.reducer(calendarWithActiveEventsState, onLogoutCalendar())
        expect(state).toEqual(initialState)
        
       })
      

 })