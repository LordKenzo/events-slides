# EventsSlides

In questo primo commit del progetto voglio far vedere come far comunicare i componenti tra loro senza l'utilizzo di `@Input()` e `@Output()`:

- Come posso passare dati da un Componente Container ad un Component Presentational senza `@Input` ma impostando la prorietà nel component presentation attraverso una proprietà `get` ed un `Service` che mantiene il dato dell'elemento selezionato.
- Come posso selezionare dalla lista un evento e, tramite il `Service`, visualizzarlo in un componente di "pari livello".