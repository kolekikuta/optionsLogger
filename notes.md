# Project Notes

## Frontend
- shadcn ui for table (sortable, searchable)
- css for table row background, element colors, progress bar
- header
- controlled inputs for all log creator input fields
- shadcn ui for date picker
- table cell colors for call, put and shares, maybe other colors to differentiate from profit/loss

### Log Creator Worflow
- Frontend checks all required fields are completed
- Backend verifies ticker symbol exists
    - if not, return error code
    - if does, save to db
    - save on log creator should trigger re-render of position table

### Todo
[ ] Home page
    [ ] Chart
    [ ] Log Creator
        [x] functionality
        [ ] formatting
    [ ] Position Logs
[ ] Landing Page
[x] Login Page
[x] Sign Up Page
[ ] Header (log out, home button)


## Backend
    - Flask backend server
    - fetching historical data
    - calculating returns
    - calculate dte for positions


### Todo
    [x] function for downloading historical stock data from yfinance
    [ ] querying database for existing historical data
    [ ] writing historical data to database
    [x] writing user data to database
    [x] writing position log to database
    [ ] querying db for user's positions
    [ ] calculating returns on positions
    [x] connect to database
    [ ] fetching options chains
        - store contract symbol on write, fetch contract info and update in databse
    [x] check for valid ticker in log creator

## Database
    - Positions - options positions data linked to Users by UID
    - Ticker Historical Data - historical data indexed by ticker


### Todo
    [x] initialize database and tables
    [ ] row level auth (read/write)

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

## Auth
- supabase auth sdk
