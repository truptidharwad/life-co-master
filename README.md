# Nightlife Coordinator

Web app to find out who's hanging out tonight where.

## User Stories

1. [x] As an unauthenticated user, I can view all bars in my area.
1. [x] As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
1. [x] As an authenticated user, I can remove myself from a bar if I no longer want to go there.
1. [x] As an unauthenticated user, when I login I should not have to search again.

## Attribution

Business data is pulled from Yelp's Fusion API.

## Minimum State Sketch

```
state = {
  username: '',
  searchTerm: '',
  businesses: [
    {
      id: 'business-id',
      isCheckedIn: false,
      checkins: 2,
      name: 'name',
      url: 'url',
    },
    {
      id: 'business-id',
      isCheckedIn: false,
      ...
    }
  ]
}
```
