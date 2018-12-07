/**
 * Use to define constants to use at global scope
 */

const globalConstants = {
  socketActionTypes: {
    REQUEST_CALL_CANCEL: 'REQUEST_CALL_CANCEL', // Caller Cancel the call
    REQUEST_CALL: 'REQUEST_CALL', // Caller request a call
    USER_IS_BUSY: 'USER_IS_BUSY',
    USER_IS_READY: 'USER_IS_READY',
    USER_CANCEL_CALL: 'USER_CANCEL_CALL',
    USER_ACCEPT_CALL: 'USER_ACCEPT_CALL',
    USER_WINDOW_END_CALL: 'USER_WINDOW_END_CALL',
    USER_END_CALL: 'USER_END_CALL',
    FILE_UPLOADED: 'FILE_UPLOADED',
    HAVE_USER_ACCEPT_REQUEST: 'HAVE_USER_ACCEPT_REQUEST',
    USER_REQUEST_BEGIN_TIMER: 'USER_REQUEST_BEGIN_TIMER',
    SERVER_BEGIN_TIMER: 'SERVER_BEGIN_TIMER',

    // When have error
    SERVER_TRANSACTION_FAILED: 'SERVER_TRANSACTION_FAILED',

    // Chat session actions
    REQUEST_BEGIN_CHAT_SESSION: 'REQUEST_BEGIN_CHAT_SESSION',
    REQUEST_CANCEL_CHAT_SESSION: 'REQUEST_CANCEL_CHAT_SESSION',
    REQUEST_END_CHAT_SESSION: 'REQUEST_END_CHAT_SESSION',
    REQUEST_WINDOW_END_CHAT_SESSION: 'REQUEST_WINDOW_END_CHAT_SESSION',
    RESPONSE_ACCEPT_CHAT_SESSION: 'RESPONSE_ACCEPT_CHAT_SESSION',
    RESPONSE_CANCEL_CHAT_SESSION: 'RESPONSE_CANCEL_CHAT_SESSION',

    // Transaction actions
    RESPONSE_OUT_OF_MONEY: 'RESPONSE_OUT_OF_MONEY',

    // User update expert info
    USER_UPDATE_EXPERT_INFO: 'USER_UPDATE_EXPERT_INFO',
    // When user logout
    USER_LOGOUT: 'USER_LOGOUT',
    // When status of user change
    USER_STATUS_CHANGE: 'USER_STATUS_CHANGE'
  },
  socketActions: {
    CLIENT: {
      REQUEST: 'CLIENT_REQUEST',
      RESPONSE: 'CLIENT_RESPONSE'
    },
    SERVER: {
      REQUEST: 'SERVER_REQUEST',
      RESPONSE: 'SERVER_RESPONSE'
    }
  },
  userState: {
    OFFLINE: 0,
    ONLINE:  1,
    BUSY:    2,
    READY:   3
  },
  // Chat file upload configs
  chatMaxFileSize: 10485760, // In bytes <=> 10MB
  chatMaxFiles: 10,
  fileTypeAccept: [],
  // In ms, time waiting for receiver answer the call
  sessionWaitingTime: 120000,
  // User's roles
  role: {
    USER: 'user',
    ADMIN: 'admin',
    MANAGER: 'manager'
  },
  stopWords: [
    "a", "about", "above", "above", "across", "after", "afterwards", "again",
    "against", "all", "almost", "alone", "along", "already", "also","although",
    "always","am","among", "amongst", "amoungst", "amount",  "an", "and",
    "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are",
    "around", "as",  "at", "back","be","became", "because","become","becomes",
    "becoming", "been", "before", "beforehand", "behind", "being", "below",
    "beside", "besides", "between", "beyond", "bill", "both", "bottom","but",
    "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt",
    "cry", "de", "describe", "detail", "do", "done", "down", "due", "during",
    "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty",
    "enough", "etc", "even", "ever", "every", "everyone", "everything",
    "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire",
    "first", "five", "for", "former", "formerly", "forty", "found", "four",
    "from", "front", "full", "further", "get", "give", "go", "had", "has",
    "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby",
    "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how",
    "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into",
    "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least",
    "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill",
    "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my",
    "myself", "name", "namely", "neither", "never", "nevertheless", "next",
    "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now",
    "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or",
    "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over",
    "own","part", "per", "perhaps", "please", "put", "rather", "re", "same",
    "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she",
    "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some",
    "somehow", "someone", "something", "sometime", "sometimes", "somewhere",
    "still", "such", "system", "take", "ten", "than", "that", "the", "their",
    "them", "themselves", "then", "thence", "there", "thereafter", "thereby",
    "therefore", "therein", "thereupon", "these", "they", "thickv", "thin",
    "third", "this", "those", "though", "three", "through", "throughout", "thru",
    "thus", "to", "together", "too", "top", "toward", "towards", "twelve",
    "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via",
    "was", "we", "well", "were", "what", "whatever", "when", "whence",
    "whenever", "where", "whereafter", "whereas", "whereby", "wherein",
    "whereupon", "wherever", "whether", "which", "while", "whither", "who",
    "whoever", "whole", "whom", "whose", "why", "will", "with", "within",
    "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves",
    "the"],
  // Knowledge's state
  knowledgeState: {
    DRAFT: 'draft',
    WAITING: 'waiting',
    PUBLISHED: 'published'
  },
  // Queue job name
  jobName: {
    KLGE_GET_THUMBNAILS: 'knowledgeGetThumbnails',
    KLGE_SYNC_ELASTIC: 'knowledgeSyncElastic'
  },
  langLevels: {
    Elementary: 'langElementary',
    LimitedWorking: 'langLimitedWorking',
    Professional: 'langProfessional',
    FullProfessional: 'langFullProfessional',
    Native: 'langNative'
  }
};

export default globalConstants;