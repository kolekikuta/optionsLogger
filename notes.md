# Project Notes

## Frontend
- shadcn ui for table (sortable, searchable)
- css for table row background, element colors, progress bar
- header

### Todo
[ ] Home page
    [ ] Chart
    [ ] Log Creator
        - double check with brandon on request parameters
    [ ] Position Logs
[ ] Landing Page
[ ] Login Page
[ ] Header (log out, home button)


## Backend
    - Flask backend server
    - fetching historical data
    - calculating returns


### Todo
    [x] function for downloading historical stock data from yfinance
    [ ] querying database for existing historical data
    [ ] writing historical data to database
    [x] writing user data to database
    [x] writing position log to database
    [ ] calculating returns on positions
    [x] connect to database
    [ ] fetching options chains

## Database
    - Users table - user information and UID
    - Positions - options positions data linked to Users by UID
    - Ticker Historical Data - historical data indexed by ticker


### Todo
    [x] initialize database and tables

## Log Creator
- Entry Date
- Expiration
- Type (Call, Put, Shares)
- Strike (stock price that will be exercised)
- Entry Premium
- Exit Stock Price
- Exit Premium
- Current stock data and options chains
    - if position isnt closed, just make exit values the current amount
- Amount/Number (number of contracts at 100 shares)

- Stock Price Column (entry on left, exit or current)

- Shares (entry date, stock price)

- Graph - initial show portfolio value
    - focus on a log, show the entry and exit