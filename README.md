# EventsSlides

In questo primo commit del progetto voglio far vedere come far comunicare i componenti tra loro senza l'utilizzo di `@Input()` e `@Output()`:

- Come posso passare dati da un Componente Container ad un Component Presentational senza `@Input` ma impostando la prorietà nel component presentation attraverso una proprietà `get` ed un `Service` che mantiene il dato dell'elemento selezionato.
- Come posso selezionare dalla lista un evento e, tramite il `Service`, visualizzarlo in un componente di "pari livello".

In questo soluzione ho tralasciato volontariamente la creazione di un modulo di routing ed un modulo di features per concentrarmi sulla comunicazione tra i componenti ed il service. Pertanto i componenti saranno tutti dichiarati nell'`AppModule`.

In questo branch '01-service-getter', i componenti che ho definito sono:
- un componente `event-shell` che funziona da root per `event-list` e `event-details`
- un componente `event-list` che preleva gli eventi dal `Service` e riceve un Observable<Event[]> e alla selezione di un evento imposta una proprietà del `Service` per tenere in memoria l'evento. Questo mi permette di visualizzare il dettaglio dell'evento selezionato anche se mi sposto in un'altra pagine dell'applicazione e torno sulla pagina degli eventi. Al momento non ho però altre pagine :D
- un componente `event-details` che utilizza il getter per fare il binding dal template al service, prendendo l'evento attualmente selezionato.

Con questa soluzione, gli unici due elementi che hanno bisogno di accedere al `Service` sono `event-list` e `event-details`.
Quindi abbiamo un componente container che in realtà non incapsula nessuna logica ne ha accesso al service, mentre i due componenti interni invece colloquiano direttamente con il `Service`.
Questo tipo di soluzione va benissimo per piccoli progetti con pochissimi componenti e `Service`, in quanto è gestibile il fatto che abbiamo accessi al `Service` da più componenti.
Però non è una architettura scalabile. Solitamente si tende ad avere, come da linee guide Angular, componenti il più possibile "dummy/presentational" e quindi che ignorano di fatto come ricevo i dati e come questi vengono elaborati da altri componenti. Ed un primo passo in tale direzione è evitare l'uso dei `Service` dentro questa tipologia di componenti.

## Input Output Branch

Proviamo ora a spostare la logica di acquisizione dati e sincronizzazione, in `event-shell` con @Input() e @Output().

In questa soluzione il nostro `Service` è inserito come dipendenza al solo componente Container `event-shell` che diventa il "regista" dell'invio dati e sincronizzazione dati tra gli altri due componenti. Ho centralizzato il mio stato e comunicazione in un architettura di base meno complessa dal punto di vista del controllo.

## Template Reference Variable

Possiamo accedere direttamente alla proprietà di un componente dal padre anche grazie al `Template Reference Variable`. In Event Details abbiamo la proprietà `event` che viene impostata con il decoratore @Input() dal padre. Posso però dichiarare nel template di `event-shell` una template reference a `event-details` (es. `#eventdetail`) e nel momento della selezione dell'evento dalla lista, impostare, tramite un get/set la proprietà `event` di `event-details`.

```html
<event-list [events]='events$ | async' (selectEvent)='handleEventSelection($event); eventdetail.event = $event;'></event-list>
...
<event-details #eventdetail></event-details>
```

Questa soluzione però va ad inserire troppa logica nel template, che deve rimanere il più semplice possibile. Ma è una possibilità che dobbiamo conoscere.

## Service Subject

In questo branch andiamo a modificare il nostro progetto in modo tale che la selezione viene propagata dalla lista -> shell -> service -> detail tramite un Observable.
Quando creiamo un Observable passiamo una funzione detta "observer" il cui argomento è un oggetto Observer che ha la capacità di emettere valori con next:

```js
const observable = new Observable(observer => {
  setTimeout(() => observer.next(`Hello, I'm an Observable! ${Math.random()}`), 1000);
});
```

Gli Observable di default sono Lazy e detti "Cold", ovvero non producono codice fino a che non ho un subscriber, cioè un consumatore del dato, inoltre gli observable non condivino il dato prodotto con i vari subscriber, ma ognuno avrà il suo valore:

[Link](https://goo.gl/X1MghS)
```js
// In questo playground devo usare Rx.
const observable = new Rx.Observable(observer => {
  setTimeout(() => observer.next(`Hello, I'm an Observable! ${Math.random()}`), 1000);
});
observable.subscribe(data => console.log(data));
observable.subscribe(data => console.log(data));
observable.subscribe(data => console.log(data));
```

I Subject sono un particolare Observable di tipo "Hot" che possono emettere valori ancora prima di avere dei Subscriber e quindi i subscriber possono "perdersi" dei valori, inoltre il valore prodotto è condiviso tra tutti i subscriber:

[Link](https://goo.gl/Ym3DdY)
```js
const observable = new Rx.Subject();
observable.subscribe(data => console.log(data));
observable.subscribe(data => console.log(data));
observable.subscribe(data => console.log(data));
observable.next(`Hello, I'm an Observable! ${Math.random()}`);
```

Convenzioni da seguire:
[Naming Conventions](https://angular.io/guide/rx-library#naming-conventions-for-observables)

Nel progetto andiamo ad utilizzare un Subject privato, solitamente chiamiamo questo subject postponendo Source al nome della proprietà e si dichiara privato in modo tale da non permette l'emissione di valori esternamente al service. Per questo motivo dichiariamo un Observable pubblico e che verrà acceduto dall'esterno.
Quando avviene una selezione, lo comunichiamo al service, unico responsabile per fare il next, e quindi emettere il valore di selezione:

```js
  private eventSelectedSource = new Subject<Event>();
  public eventSelected$ = this.eventSelectedSource.asObservable();

  selectEvent(event: Event) {
    this.eventSelectedSource.next(event);
  }
```

## Service e Observable

Supponiamo di non volere usare Subject ma un approccio classico con Observable, e proviamo una prima ipotesi poco elegante. Mi dichiaro il mio Observale:

```js
public eventSelected$: Observable<Event>;
```

e quello che cambia sarà il mio metodo nel service di selezione evento:

```js
public eventSelected$: Observable<Event>;
...
selectEvent(event: Event) {
  this.eventSelected$ = new Observable( observer => observer.next(event));
  const subscription = this.eventSelected$.subscribe(eventSelected => {
    return eventSelected;
  });
  subscription.unsubscribe();
}
```

ed il fatto che nell'`event-shell` ora devo impostare il valore del mio Observable ogni volta che seleziono l'evento:

```js
ngOnInit() {
  this.events$ = this.eventService.loadEvents();
  this.eventSelected$ = this.eventService.eventSelected$;
}

handleEventSelection(event: Event) {
  this.eventService.selectEvent(event);
  this.eventSelected$ = this.eventService.eventSelected$;
}
```

Terribile! Proviamo invece ad avere una high order function che "wrappa" il mio Observer e mi ritorna una funzione a cui posso passare l'evento selezionato:

```js
private eventEmit: (event: Event) => void;
public eventSelected$: Observable<Event> = new Observable( observer => {
  this.eventEmit = (event: Event) => observer.next(event);
});
...
selectEvent(event: Event) {
  this.eventEmit(event);
}
```

Ora posso avere semplicemente questo nella ngOnInit del mio componente:

```js
ngOnInit() {
  this.events$ = this.eventService.loadEvents();
  this.eventSelected$ = this.eventService.eventSelected$;
}

handleEventSelection(event: Event) {
  this.eventService.selectEvent(event);
}
```

Ho una soluzione simile alla Subject ma con il solo uso di Observable.
Prova ad avere nel template di `event-shell` due componenti di dettaglio. Funzionerà?

```html
<div class="col-md-3">
  <event-details [event]='eventSelected$ | async'></event-details>
</div>
<div class="col-md-3">
  <event-details [event]='eventSelected$ | async'></event-details>
</div>
```

Con il Subject si, con Obserable avrò solo il secondo componente di dettaglio come ricevente del dato.
Questo mette in evidenza una distinzione forte tra Observable e Subject. Quest'ultimo ha un vero e proprio stato che mantiene una lista di Observers, mentre un Observable non è altro che una funzione che imposta un Observer.
Nel branch andiamo ad apportare delle modifiche al template e alla classe di `event-shell` per visualizzare un doppio dettaglio. Ovviamente per scopi didattici.
