# Project Notes

## Frontend
- shadcn ui for table (sortable, searchable)
- header
- controlled inputs for all log creator input fields
- shadcn ui for date picker
- table cell colors for call, put and shares, maybe other colors to differentiate from profit/loss
- dte color is percentage of contract time, linked to progress bar
    - gradient

### Log Creator Worflow
- Frontend checks all required fields are completed
- Calendars handle date validation
- Backend verifies ticker symbol exists
    - if not, return error code
    - if does, save to db
    - save on log creator should trigger re-render of position table
- maybe dont need up all the time, plus symbol button that opens a modal??

### Positions table workflow
- action menu for editing and deleting
- delete sends axios.delete to backend
- edit converts fields to inputs, and shows save and cancel button
- save sends axios.update to backend
- pagination in table

### Header
- Profile Icon
    - dropdown menu, profile page
    - logout

### Charts
- Multiple time frames
- Zoom and hover info
- display option entry and expiration/exit
- default is portfolio returns, changes based on which option is selected

### Folder Structure
- pop out sidebar with folders, portfolio value, etc
- entry/row action menu - edit folders dialog
- in table, indicate which folders the position belongs to
- clicking on folder closes sidebar and changes positions in table


### Todo
[ ] Home page
    [ ] Loading screen while all data is fetched
    [ ] Chart
        [ ] Change data based on which position is selected
        [ ] Show entry and exit points
        [ ] Fallback if no data
        [ ] Title changes with data being displayed
    [x] Log Creator
        [x] writing to db
        [x] modal
    [ ] Position Logs
        [ ] pagination
    [ ] Folder System
        [x] Folder creation in sidebar
        [ ] Folder Deletion/Modification
        [x] Adding/Removing Positions to folders
        [ ] Folder value/profit loss
        [ ] Clicking folder modifies the positions shown in the table
    [ ] Sidebar
        [x] Home button does not refresh when on the home page, just closes sidebar
[ ] Landing Page
[x] Login Page
[x] Sign Up Page
[ ] Profile page
[ ] create profile email template

## Backend
    - Flask backend server
    - fetching historical data
    - calculating returns
    - calculate dte for positions
    - shares profit loss bug

### Endpoints
- Positions
    - Create
    - Get all for user
    - Validate ticker

- Historical
    - Need to figure out what day graphs need

- Folders
    - Create
    - Read
    - Update
    - Delete

### Todo
[x] function for downloading historical stock data from yfinance
[x] querying database for existing historical data
[x] writing historical data to database
[x] writing user data to database
[x] writing position log to database
[x] querying db for user's positions
[ ] calculating returns on positions
[ ] calculate portfolio returns
[x] connect to database
[ ] fetching current stock data for users positions
[x] check for valid ticker in log creator
[x] deleting positions

## Database
    - Positions - options positions data
    - Ticker Historical Data - historical data indexed by ticker
    - Folder - names of folders and user id's
    - FolderPosition - join table of folder_id's and position_id's

### Todo
[x] initialize database and tables
[x] row level auth (read/write)

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


## Auth
- supabase auth sdk

## AI
- AI insights and world news headlines???

## Folder system
- organize positions
- updates table


## Brandon
- landing page design
- login/sign up background
- folder structure/tab
- Profile
    - portfolio information
- ai insights prompt


## Greeks
- calculate greeks
- find theta
- create projections
- optimize contract expiration, strike, etc