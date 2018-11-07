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