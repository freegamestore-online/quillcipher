/** How long a quote is, which sets its difficulty. */
export type Difficulty = "easy" | "medium" | "hard";

export interface Quote {
  /** Slug, unique across the file. */
  id: string;
  text: string;
  /** Display name of the author. */
  author: string;
  /** Book, speech, letter or poem the quote comes from. */
  source: string;
  /** Year the author died. Negative for BCE. Used for the author-PD basis. */
  authorDeathYear?: number;
  /** Year the work was first published. Used for the publication-PD basis. */
  publicationYear?: number;
  difficulty: Difficulty;
}

type QuoteEntry = Omit<Quote, "difficulty">;

/** Quotes up to this many characters are easy. */
const EASY_MAX = 59;
/** Quotes up to this many characters are medium. Longer ones are hard. */
const MEDIUM_MAX = 120;

/** Difficulty from text length alone. */
export function difficultyFor(text: string): Difficulty {
  if (text.length <= EASY_MAX) return "easy";
  if (text.length <= MEDIUM_MAX) return "medium";
  return "hard";
}

/*
 * Every entry is public domain. Each one carries the author's death year, or the
 * work's publication year where the author died too recently. The verification test
 * checks that every entry has a source and one of the two years before its cut-off.
 */
const ENTRIES: readonly QuoteEntry[] = [
  // Shakespeare (d. 1616)
  { id: "shakespeare-hamlet-thine-own-self", text: "This above all: to thine own self be true.", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-hamlet-brevity", text: "Brevity is the soul of wit.", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-hamlet-borrower", text: "Neither a borrower nor a lender be.", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-hamlet-question", text: "To be, or not to be: that is the question.", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-hamlet-may-be", text: "We know what we are, but know not what we may be.", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-hamlet-method", text: "Though this be madness, yet there is method in't.", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-hamlet-frailty", text: "Frailty, thy name is woman!", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-hamlet-protest", text: "The lady doth protest too much, methinks.", author: "William Shakespeare", source: "Hamlet", authorDeathYear: 1616 },
  { id: "shakespeare-as-you-like-stage", text: "All the world's a stage, and all the men and women merely players.", author: "William Shakespeare", source: "As You Like It", authorDeathYear: 1616 },
  { id: "shakespeare-as-you-like-adversity", text: "Sweet are the uses of adversity.", author: "William Shakespeare", source: "As You Like It", authorDeathYear: 1616 },
  { id: "shakespeare-tempest-stuff", text: "We are such stuff as dreams are made on, and our little life is rounded with a sleep.", author: "William Shakespeare", source: "The Tempest", authorDeathYear: 1616 },
  { id: "shakespeare-tempest-brave-new-world", text: "O brave new world, that has such people in't.", author: "William Shakespeare", source: "The Tempest", authorDeathYear: 1616 },
  { id: "shakespeare-romeo-rose", text: "What's in a name? That which we call a rose by any other name would smell as sweet.", author: "William Shakespeare", source: "Romeo and Juliet", authorDeathYear: 1616 },
  { id: "shakespeare-romeo-parting", text: "Parting is such sweet sorrow.", author: "William Shakespeare", source: "Romeo and Juliet", authorDeathYear: 1616 },
  { id: "shakespeare-caesar-cowards", text: "Cowards die many times before their deaths; the valiant never taste of death but once.", author: "William Shakespeare", source: "Julius Caesar", authorDeathYear: 1616 },
  { id: "shakespeare-caesar-stars", text: "The fault, dear Brutus, is not in our stars, but in ourselves.", author: "William Shakespeare", source: "Julius Caesar", authorDeathYear: 1616 },
  { id: "shakespeare-twelfth-greatness", text: "Some are born great, some achieve greatness, and some have greatness thrust upon 'em.", author: "William Shakespeare", source: "Twelfth Night", authorDeathYear: 1616 },
  { id: "shakespeare-twelfth-music", text: "Music be the food of love, play on.", author: "William Shakespeare", source: "Twelfth Night", authorDeathYear: 1616 },
  { id: "shakespeare-dream-true-love", text: "The course of true love never did run smooth.", author: "William Shakespeare", source: "A Midsummer Night's Dream", authorDeathYear: 1616 },
  { id: "shakespeare-henry-valour", text: "The better part of valour is discretion.", author: "William Shakespeare", source: "Henry IV, Part 1", authorDeathYear: 1616 },
  { id: "shakespeare-macbeth-spot", text: "Out, damned spot!", author: "William Shakespeare", source: "Macbeth", authorDeathYear: 1616 },
  { id: "shakespeare-macbeth-toil", text: "Double, double toil and trouble.", author: "William Shakespeare", source: "Macbeth", authorDeathYear: 1616 },
  { id: "shakespeare-all-well-trust", text: "Love all, trust a few, do wrong to none.", author: "William Shakespeare", source: "All's Well That Ends Well", authorDeathYear: 1616 },
  { id: "shakespeare-sonnet-116", text: "Let me not to the marriage of true minds admit impediments.", author: "William Shakespeare", source: "Sonnet 116", authorDeathYear: 1616 },

  // Jane Austen (d. 1817)
  { id: "austen-pride-fortune", text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", author: "Jane Austen", source: "Pride and Prejudice", authorDeathYear: 1817, publicationYear: 1813 },
  { id: "austen-northanger-reading", text: "I declare after all there is no enjoyment like reading!", author: "Jane Austen", source: "Northanger Abbey", authorDeathYear: 1817, publicationYear: 1817 },

  // Charles Dickens (d. 1870)
  { id: "dickens-two-cities-best", text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way.", author: "Charles Dickens", source: "A Tale of Two Cities", authorDeathYear: 1870, publicationYear: 1859 },
  { id: "dickens-oliver-more", text: "Please, sir, I want some more.", author: "Charles Dickens", source: "Oliver Twist", authorDeathYear: 1870, publicationYear: 1838 },
  { id: "dickens-carol-humbug", text: "Bah! Humbug!", author: "Charles Dickens", source: "A Christmas Carol", authorDeathYear: 1870, publicationYear: 1843 },

  // Mark Twain (d. 1910)
  { id: "twain-report-exaggeration", text: "The report of my death was an exaggeration.", author: "Mark Twain", source: "Letter to the New York Journal (1897)", authorDeathYear: 1910 },

  // Oscar Wilde (d. 1900)
  { id: "wilde-windermere-temptation", text: "I can resist everything except temptation.", author: "Oscar Wilde", source: "Lady Windermere's Fan", authorDeathYear: 1900, publicationYear: 1892 },
  { id: "wilde-windermere-experience", text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde", source: "Lady Windermere's Fan", authorDeathYear: 1900, publicationYear: 1892 },
  { id: "wilde-earnest-truth", text: "The truth is rarely pure and never simple.", author: "Oscar Wilde", source: "The Importance of Being Earnest", authorDeathYear: 1900, publicationYear: 1895 },
  { id: "wilde-gaol-kills", text: "Each man kills the thing he loves.", author: "Oscar Wilde", source: "The Ballad of Reading Gaol", authorDeathYear: 1900, publicationYear: 1898 },

  // Abraham Lincoln (d. 1865)
  { id: "lincoln-house-divided", text: "A house divided against itself cannot stand.", author: "Abraham Lincoln", source: "House Divided speech (1858)", authorDeathYear: 1865 },
  { id: "lincoln-gettysburg-government", text: "Government of the people, by the people, for the people, shall not perish from the earth.", author: "Abraham Lincoln", source: "Gettysburg Address (1863)", authorDeathYear: 1865 },

  // Ralph Waldo Emerson (d. 1882)
  { id: "emerson-nonconformist", text: "Whoso would be a man must be a nonconformist.", author: "Ralph Waldo Emerson", source: "Self-Reliance", authorDeathYear: 1882, publicationYear: 1841 },
  { id: "emerson-imitate", text: "Insist on yourself; never imitate.", author: "Ralph Waldo Emerson", source: "Self-Reliance", authorDeathYear: 1882, publicationYear: 1841 },

  // Henry David Thoreau (d. 1862)
  { id: "thoreau-simplify", text: "Simplify, simplify.", author: "Henry David Thoreau", source: "Walden", authorDeathYear: 1862, publicationYear: 1854 },
  { id: "thoreau-deliberately", text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.", author: "Henry David Thoreau", source: "Walden", authorDeathYear: 1862, publicationYear: 1854 },
  { id: "thoreau-quiet-desperation", text: "The mass of men lead lives of quiet desperation.", author: "Henry David Thoreau", source: "Walden", authorDeathYear: 1862, publicationYear: 1854 },

  // Benjamin Franklin (d. 1790)
  { id: "franklin-well-done", text: "Well done is better than well said.", author: "Benjamin Franklin", source: "Poor Richard's Almanack", authorDeathYear: 1790 },
  { id: "franklin-haste", text: "Haste makes waste.", author: "Benjamin Franklin", source: "Poor Richard's Almanack", authorDeathYear: 1790 },
  { id: "franklin-three-secret", text: "Three may keep a secret, if two of them are dead.", author: "Benjamin Franklin", source: "Poor Richard's Almanack", authorDeathYear: 1790 },

  // Abraham Lincoln (d. 1865), the opening of the Gettysburg Address
  { id: "lincoln-gettysburg-four-score", text: "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.", author: "Abraham Lincoln", source: "Gettysburg Address (1863)", authorDeathYear: 1865 },

  // Thomas Jefferson (d. 1826)
  { id: "jefferson-self-evident", text: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.", author: "Thomas Jefferson", source: "Declaration of Independence", authorDeathYear: 1826, publicationYear: 1776 },

  // Mary Shelley (d. 1851)
  { id: "shelley-frankenstein-knowledge", text: "Learn from me, if not by my precepts, at least by my example, how dangerous is the acquirement of knowledge.", author: "Mary Shelley", source: "Frankenstein", authorDeathYear: 1851, publicationYear: 1818 },

  // Lewis Carroll (d. 1898)
  { id: "carroll-alice-beginning", text: "Begin at the beginning, and go on till you come to the end: then stop.", author: "Lewis Carroll", source: "Alice's Adventures in Wonderland", authorDeathYear: 1898, publicationYear: 1865 },
  { id: "carroll-alice-curiouser", text: "Curiouser and curiouser!", author: "Lewis Carroll", source: "Alice's Adventures in Wonderland", authorDeathYear: 1898, publicationYear: 1865 },
  { id: "carroll-alice-all-mad", text: "We're all mad here.", author: "Lewis Carroll", source: "Alice's Adventures in Wonderland", authorDeathYear: 1898, publicationYear: 1865 },
  { id: "carroll-looking-glass-impossible", text: "Sometimes I've believed as many as six impossible things before breakfast.", author: "Lewis Carroll", source: "Through the Looking-Glass", authorDeathYear: 1898, publicationYear: 1871 },

  // Leo Tolstoy (d. 1910)
  { id: "tolstoy-karenina-families", text: "All happy families are alike; each unhappy family is unhappy in its own way.", author: "Leo Tolstoy", source: "Anna Karenina", authorDeathYear: 1910, publicationYear: 1877 },

  // Friedrich Nietzsche (d. 1900)
  { id: "nietzsche-why-how", text: "He who has a why to live for can bear almost any how.", author: "Friedrich Nietzsche", source: "Twilight of the Idols", authorDeathYear: 1900, publicationYear: 1889 },
  { id: "nietzsche-monsters", text: "Whoever fights monsters should see to it that in the process he does not become a monster.", author: "Friedrich Nietzsche", source: "Beyond Good and Evil", authorDeathYear: 1900, publicationYear: 1886 },

  // Seneca (d. 65)
  { id: "seneca-imagination", text: "We suffer more often in imagination than in reality.", author: "Seneca", source: "Letters to Lucilius, Letter 13", authorDeathYear: 65 },

  // Plato (d. 348 BCE)
  { id: "plato-unexamined", text: "The unexamined life is not worth living.", author: "Plato", source: "Apology", authorDeathYear: -348 },

  // Dante Alighieri (d. 1321)
  { id: "dante-abandon-hope", text: "Abandon all hope, ye who enter here.", author: "Dante Alighieri", source: "Inferno, Canto III", authorDeathYear: 1321 },

  // René Descartes (d. 1650)
  { id: "descartes-therefore", text: "I think, therefore I am.", author: "René Descartes", source: "Discourse on the Method", authorDeathYear: 1650, publicationYear: 1637 },

  // Voltaire (d. 1778)
  { id: "voltaire-garden", text: "We must cultivate our garden.", author: "Voltaire", source: "Candide", authorDeathYear: 1778, publicationYear: 1759 },

  // Alexander Pope (d. 1744)
  { id: "pope-to-err", text: "To err is human; to forgive, divine.", author: "Alexander Pope", source: "An Essay on Criticism", authorDeathYear: 1744, publicationYear: 1711 },

  // Samuel Johnson (d. 1784)
  { id: "johnson-london", text: "When a man is tired of London, he is tired of life.", author: "Samuel Johnson", source: "The Life of Samuel Johnson", authorDeathYear: 1784, publicationYear: 1791 },

  // Robert Burns (d. 1796)
  { id: "burns-mouse", text: "The best laid schemes o' mice an' men gang aft agley.", author: "Robert Burns", source: "To a Mouse", authorDeathYear: 1796 },

  // Walter Scott (d. 1832)
  { id: "scott-tangled-web", text: "Oh, what a tangled web we weave, when first we practise to deceive!", author: "Walter Scott", source: "Marmion", authorDeathYear: 1832, publicationYear: 1808 },

  // Thomas Paine (d. 1809)
  { id: "paine-souls", text: "These are the times that try men's souls.", author: "Thomas Paine", source: "The American Crisis, No. 1", authorDeathYear: 1809, publicationYear: 1776 },

  // Patrick Henry (d. 1799)
  { id: "henry-liberty", text: "Give me liberty, or give me death!", author: "Patrick Henry", source: "Speech to the Virginia Convention (1775)", authorDeathYear: 1799 },

  // John Keats (d. 1821) and Percy Bysshe Shelley (d. 1822)
  { id: "keats-endymion-joy", text: "A thing of beauty is a joy for ever.", author: "John Keats", source: "Endymion", authorDeathYear: 1821, publicationYear: 1818 },
  { id: "shelley-west-wind", text: "O Wind, If Winter comes, can Spring be far behind?", author: "Percy Bysshe Shelley", source: "Ode to the West Wind", authorDeathYear: 1822, publicationYear: 1820 },

  // Edgar Allan Poe (d. 1849)
  { id: "poe-raven-nevermore", text: "Quoth the Raven, 'Nevermore.'", author: "Edgar Allan Poe", source: "The Raven", authorDeathYear: 1849, publicationYear: 1845 },

  // Herman Melville (d. 1891)
  { id: "melville-ishmael-call", text: "Call me Ishmael.", author: "Herman Melville", source: "Moby-Dick", authorDeathYear: 1891, publicationYear: 1851 },

  // Charlotte Brontë (d. 1855)
  { id: "bronte-reader-married", text: "Reader, I married him.", author: "Charlotte Brontë", source: "Jane Eyre", authorDeathYear: 1855, publicationYear: 1847 },

  // Walt Whitman (d. 1892)
  { id: "whitman-multitudes", text: "I am large, I contain multitudes.", author: "Walt Whitman", source: "Song of Myself", authorDeathYear: 1892, publicationYear: 1855 },

  // Emily Dickinson (d. 1886)
  { id: "dickinson-hope-feathers", text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson", source: "Poem 254", authorDeathYear: 1886 },

  // Alfred, Lord Tennyson (d. 1892)
  { id: "tennyson-loved-lost", text: "'Tis better to have loved and lost than never to have loved at all.", author: "Alfred, Lord Tennyson", source: "In Memoriam A.H.H.", authorDeathYear: 1892, publicationYear: 1850 },
  { id: "tennyson-ulysses-strive", text: "To strive, to seek, to find, and not to yield.", author: "Alfred, Lord Tennyson", source: "Ulysses", authorDeathYear: 1892, publicationYear: 1842 },
  { id: "tennyson-light-brigade", text: "Theirs not to reason why, theirs but to do and die.", author: "Alfred, Lord Tennyson", source: "The Charge of the Light Brigade", authorDeathYear: 1892, publicationYear: 1854 },

  // Robert Browning (d. 1889)
  { id: "browning-grow-old", text: "Grow old along with me! The best is yet to be.", author: "Robert Browning", source: "Rabbi Ben Ezra", authorDeathYear: 1889, publicationYear: 1864 },

  // Heinrich Heine (d. 1856)
  { id: "heine-books-people", text: "Where they burn books, they will also, in the end, burn people.", author: "Heinrich Heine", source: "Almansor", authorDeathYear: 1856, publicationYear: 1821 },

  // John Stuart Mill (d. 1873)
  { id: "mill-sovereign", text: "Over himself, over his own body and mind, the individual is sovereign.", author: "John Stuart Mill", source: "On Liberty", authorDeathYear: 1873, publicationYear: 1859 },

  // Henrik Ibsen (d. 1906)
  { id: "ibsen-alone", text: "The strongest man in the world is he who stands most alone.", author: "Henrik Ibsen", source: "An Enemy of the People", authorDeathYear: 1906, publicationYear: 1882 },

  // Frederick Douglass (d. 1895)
  { id: "douglass-power-concedes", text: "Power concedes nothing without a demand. It never did and it never will.", author: "Frederick Douglass", source: "Speech at Canandaigua, New York (1857)", authorDeathYear: 1895 },

  // Emma Lazarus (d. 1887)
  { id: "lazarus-tired-poor", text: "Give me your tired, your poor, your huddled masses yearning to breathe free.", author: "Emma Lazarus", source: "The New Colossus", authorDeathYear: 1887, publicationYear: 1883 },

  // Arthur Conan Doyle (d. 1930)
  { id: "doyle-impossible", text: "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.", author: "Arthur Conan Doyle", source: "The Sign of the Four", authorDeathYear: 1930, publicationYear: 1890 },

  // Rudyard Kipling (d. 1936)
  { id: "kipling-if-head", text: "If you can keep your head when all about you are losing theirs and blaming it on you.", author: "Rudyard Kipling", source: "If—", authorDeathYear: 1936, publicationYear: 1910 },

  // George Bernard Shaw (d. 1950)
  { id: "shaw-can-does", text: "He who can, does. He who cannot, teaches.", author: "George Bernard Shaw", source: "Man and Superman", authorDeathYear: 1950, publicationYear: 1903 },

  // Robert Frost (d. 1963; publication year is the PD basis)
  { id: "frost-two-roads", text: "Two roads diverged in a wood, and I took the one less traveled by.", author: "Robert Frost", source: "The Road Not Taken", authorDeathYear: 1963, publicationYear: 1916 },
  { id: "frost-woods-lovely", text: "The woods are lovely, dark and deep, but I have promises to keep.", author: "Robert Frost", source: "Stopping by Woods on a Snowy Evening", authorDeathYear: 1963, publicationYear: 1923 },
];

/** The full catalogue, with difficulty derived from each text once, at load. */
export const QUOTES: readonly Quote[] = ENTRIES.map((entry) => ({
  ...entry,
  difficulty: difficultyFor(entry.text),
}));
