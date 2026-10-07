// Interface copy that lives in the website's components rather than its content files
// (src/components/**). Kept here so no widget hard-codes a string.

abstract final class AppCopy {
  static const appName = 'SETABASE';

  // Navigation
  static const tabHome = 'Home';
  static const tabServices = 'Services';
  static const tabGuide = 'Guide';
  static const tabContact = 'Contact';
  static const menu = 'Menu';
  static const back = 'Back';

  // Splash
  static const splashTitle = 'Everything your property needs, all in one place.';

  /// The website footer's tagline (src/components/SiteFooter.tsx).
  static const splashTagline =
      'Property, facility, relocation and real estate — one partner in New Cairo instead of five.';
  static const getStarted = 'Get started';
  static const exploreServices = 'Explore services';

  // Onboarding
  static const continueLabel = 'Continue';
  static const modelHint = 'Tap a building — the villa is Private, the towers are Business.';
  static const siteModelLabel = 'A villa and two office towers on one site';

  // Home
  static const switchAudience = 'Switch';
  static const whatWeDo = 'What we do';
  static const seeAll = 'See all';
  static String departmentsOneBuilding(int n) =>
      '${_numberWord(n)} ${n == 5 ? 'departments' : 'services'}, one building';
  static const guideEyebrow = 'Guide';
  static const footerPlace = 'SETABASE Services · New Cairo, Egypt';

  // Services
  static const takeMeThere = 'Take me there';
  static const roofEyebrow = 'The roof';
  static const roofTitle = 'One team, one point of contact.';
  static const notSure = 'Not sure where to start?';
  static const notSureText = 'Describe the situation — we’ll route it to the right team.';
  static const talkToTeam = 'Talk to our team';
  static String floorTag(int n) => 'Floor ${n.toString().padLeft(2, '0')}';
  static String towerLabel(int n) => 'A building of $n floors, one per service';

  // Service detail
  static const howItWorks = 'How it works';
  static const whatItCosts = 'What it costs';
  static const seePackages = 'See the packages';
  static String askAbout(String title) => 'Ask about $title';

  // Guide
  static const inTheLeak = 'In the leak';
  static const leakChip = 'Leak in flat 2A';
  static const explainerLabel = 'A three-storey block with a pipe leaking into one flat';

  // Contact
  static const contactEyebrow = 'Talk to our team';
  static const fieldName = 'Name';
  static const fieldNameHint = 'Your full name';
  static const fieldCompanyOptional = 'Company (optional)';
  static const fieldCompanyHint = 'Company name';
  static const fieldEmail = 'Email';
  static const fieldEmailHint = 'you@email.com';
  static const fieldInterest = 'I\'m interested in';
  static const fieldMessage = 'Message';
  static const fieldMessageHint = 'Tell us a little about what you need';
  static const sending = 'Sending…';
  static const ourOffice = 'Our office';
  static const visit = 'Visit';
  static const call = 'Call';
  static const getDirections = 'Get directions';
  static String contactFailed(String email) => 'The request didn’t go through. Try again, or email us at $email.';

  // Package requests (both planners)
  static const fieldYourName = 'Your name';
  static const fieldCompany = 'Company';
  static const fieldWorkEmail = 'Work email';
  static const fieldWorkEmailHint = 'you@company.com';
  static const fieldPhoneOptional = 'Phone (optional)';
  static const fieldPhoneHint = '+20';
  static const fieldAnythingElse = 'Anything else we should know? (optional)';
  static const yourSelection = 'Your selection';
  static const whatHappensNext = 'What happens next';
  static const continueToRequest = 'Continue to request';

  // Client-side validation, worded as the website's API does.
  static const errorName = 'Enter your full name.';
  static const errorCompany = 'Enter your company name.';
  static const errorEmail = 'Enter a valid email address.';
  static const errorInterest = 'Choose what you\'re interested in.';
  static const errorMessage = 'Tell us a little more — at least 10 characters.';
  static const errorPhone = 'Use digits, spaces and + only.';
  static const errorOffline = 'You\'re offline. Check your connection and try again.';
  static const errorGeneric = 'The request didn’t go through. Try again in a moment.';
  static const errorFields = 'Some fields need a second look.';

  // Request sent
  static const requestSent = 'Request sent';
  static String thankYou(String firstName) => 'Thank you, $firstName.';
  static String gotYourRequest(String service) =>
      'We\'ve got your request for $service. Our team will come back with a tailored quote within one business day.';
  static const service = 'Service';
  static const replyBy = 'Reply by';
  static const reference = 'Reference';
  static const backToHome = 'Back to home';

  // Corporate Relocation planner
  static const relocationAudience = 'Corporate Relocation, for employers';
  static const relocationSeeHow = 'See how it works';
  static const relocationStepsTitle = 'The move, step by step';
  static const relocationStepsIntro =
      'It begins with a conversation. After that, take the whole journey or only the stages you need — one person at SETABASE runs it from the first viewing to the last box.';
  static const extras = 'Extras';
  static const extrasText = 'Add any of these to the move, or on their own once the family has arrived.';
  static const moveSoFar = 'The move so far';
  static const moveEmpty = 'Choose the stages you’d like us to handle, and the new home comes together on the model.';
  static const movePriced = 'Every move is priced on its own — your quote follows the request.';
  static const relocationRequestTitle = 'Request a relocation quote';
  static const relocationRequestText =
      'Tell us who’s moving and when. We’ll come back with a plan and a price — usually within one business day.';
  static const relocationNothing = 'Nothing chosen yet. Choose stages';
  static const relocationPickOne = 'Choose at least one stage of the move or an extra above.';
  static const quotedOnRequest = 'Quoted on request';
  static const fieldPeople = 'People relocating';
  static const fieldMovingFrom = 'Moving from';
  static const fieldMovingFromHint = 'Country';
  static const fieldMovingTo = 'Moving to';
  static const fieldMovingToHint = 'Choose a city';
  static const fieldArrival = 'Arriving around (optional)';
  static const fieldArrivalHint = 'Choose a month';
  static const errorMovingFrom = 'Tell us where the move starts.';
  static const errorMovingTo = 'Choose where you\'re moving to.';
  static const errorPeople = 'Enter how many people are relocating.';
  static String stageKicker(int n, String when) => '$n. $when';
  static String extrasSummary(List<String> labels) => 'Extras: ${labels.map((l) => l.toLowerCase()).join(', ')}';
  static const extraDetail = 'Extra';

  // Special Services planner
  static const ssAudience = 'Special Services, for workplaces';
  static const ssTitle = 'An office that looks after the people in it.';
  static const ssParagraph =
      'Supplies restocked, fruit on the table, a coach on Tuesdays and an iftar in Ramadan — chosen as monthly packages and run by one team.';
  static String ssFromPrice(String price) => 'From $price EGP per employee a month';
  static const ssTrial = 'Start with a one-month trial';
  static const ssBundle = '10% off when you take two or more packages';
  static const ssChoose = 'Choose your packages';
  static const ssIntro =
      'Pick a ready package, build your own from single items, or add events. Two or more packages take 10% off.';
  static const ssEmployees = 'Employees at the office';
  static const tabPackages = 'Packages';
  static const tabBuild = 'Build your own';
  static const tabEvents = 'Events';
  static const perEmployeeMonth = 'per employee a month';
  static const add = 'Add';
  static const added = 'Added';
  static const included = 'included';
  static String buildIntro(int employees) =>
      'Add single items on top of a package, or pick 5 or more to take them on their own. Prices per month for $employees employees.';
  static const eventsIntro =
      'Pick the ones you’d like and we’ll price them for your team. Prices shown are for a group of 20.';
  static String perHirePrice(String price) => '$price per hire';
  static String perMonthPrice(String price) => '$price a month';
  static const estPackages = 'Packages and items';
  static const estBundle = 'Two or more packages, 10% off';
  static String estVolume(String rate) => 'Team size, $rate% off';
  static String estEvents(int n) => '$n event idea${n == 1 ? '' : 's'}';
  static const pricedOnRequest = 'Priced on request';
  static const estMonthly = 'Estimated per month';
  static String estPerHire(String price) => 'Plus $price for each new hire’s welcome kit.';
  static String estFlexShort(int n) =>
      'Add $n more Flexible Pack item${n == 1 ? '' : 's'} to take it on its own, or choose a package.';
  static const estNote = 'An estimate — your quote confirms the final price.';
  static const estEmpty = 'Choose packages and each one is added to the building as a floor.';
  static const contractsTitle = 'How contracts work';
  static const ssRequestTitle = 'Request your packages';
  static const ssRequestText =
      'We’ll confirm the price for your office and set up your one-month trial — usually within one business day.';
  static const ssNothing = 'Nothing chosen yet. Choose packages';
  static const fieldContract = 'Contract length (optional)';
  static const fieldContractHint = 'Not sure yet';
  static const ssPickOne = 'Choose at least one package, Flexible Pack item or event above.';
  static String ssFlexShort(int n) => 'The Flexible Pack on its own needs 5 items — add $n more, or choose a package.';
  static String chosenCount(int n) => '$n chosen';
  static String aboutMonthly(String price) => 'About $price a month';
  static const eventPricedDetail = 'Event — priced on request';
  static const catalogOffline = 'Showing our standard catalog — we couldn’t reach the live one.';
  static const retry = 'Try again';

  static String _numberWord(int n) => const {1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six'}[n] ?? '$n';
}
