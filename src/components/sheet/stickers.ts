// Die-cut stickers: original drawings on a 120 x 120 board, about Sasank rather than about the projects.
// Each has a silhouette (drawn twice: once fat in the outline colour, once in the fill), then details on top.
// Text inside a sticker is set in his own handwriting font.
export type StickerName = 'giveortake' | 'ctf' | 'hotchocolate' | 'manga' | 'record' | 'film' | 'vibecoded'

export type Sticker = {
  label: string
  href?: string
  outline: string // the die-cut edge
  fill: string
  silhouette: string
  under?: string // drawn beneath the silhouette, in the outline colour
  detail: string
}

const INK = '#1a1818'
const HAND = "font-family=\"'Sasank Hand', 'Gochi Hand', cursive\" fill=\"#1a1818\" text-anchor=\"middle\""
const shine = (d: string) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.75"/>`

export const STICKERS: Record<StickerName, Sticker> = {
  // the logo, minted: his own handwritten plus-minus
  giveortake: {
    label: 'give or take',
    outline: '#ff6f52',
    fill: '#ffd9cf',
    silhouette: '<circle cx="60" cy="60" r="46"/>',
    detail: `<circle cx="60" cy="60" r="37" fill="none" stroke="#ff6f52" stroke-width="3"/>
      <g transform="translate(35 41) scale(0.0466)" fill="${INK}" stroke="${INK}" stroke-width="40" stroke-linejoin="round"><path d="M561 7Q546 7 535 18Q525 27 522 36Q519 45 519 65Q519 81 516 90Q514 100 505 110Q496 121 477 139Q462 153 426 152Q405 152 402 150Q399 149 392 155Q384 162 370 166Q363 169 356 174Q337 187 321 187Q310 187 300 193Q294 198 290 198Q287 199 278 199Q264 199 257 202Q249 205 236 205Q225 205 220 207Q215 209 207 217Q201 223 200 225Q199 228 199 235Q198 250 207 255Q210 257 229 257Q248 258 272 258Q296 258 316 257Q335 256 338 255Q343 253 350 252Q357 252 379 252Q402 252 408 251Q415 251 420 249Q445 239 466 260Q470 265 471 268Q472 271 472 284Q473 296 472 300Q472 305 470 310Q468 313 468 318Q467 324 467 340Q467 357 467 394Q467 436 468 455Q468 474 470 482Q473 491 478 502Q483 511 499 521Q515 532 525 532Q539 532 549 513Q552 508 566 488Q568 486 570 483Q571 481 572 479Q575 474 576 465Q577 456 578 434Q578 413 578 371Q578 332 578 303Q578 274 579 273Q582 266 594 257Q607 248 622 241Q637 234 647 234Q656 234 660 232Q664 231 671 225Q676 221 678 220Q683 217 693 217Q703 217 732 217Q760 217 772 216Q783 216 786 213Q790 211 793 206Q795 202 800 196Q810 182 799 159Q794 147 793 141Q792 137 788 134Q785 131 774 124L764 117H718Q686 117 678 117Q670 118 665 120Q655 124 649 122Q643 121 633 111Q627 105 626 102Q625 100 624 91Q624 79 627 71Q629 65 630 60Q630 56 630 42Q629 27 628 23Q627 19 622 13Q614 4 614 2Q614 1 604 0Q595 -0 585 1Q575 2 573 4Q570 7 561 7ZM978 456Q955 456 949 457Q943 458 928 463Q908 469 901 474Q889 482 872 489Q856 497 850 497Q841 497 825 502Q809 507 793 515Q777 523 770 529Q753 543 738 543Q730 543 718 549Q705 555 698 555Q690 555 683 558Q675 561 663 561Q654 561 648 562Q642 564 624 570Q613 573 604 575Q596 578 594 578Q590 578 578 584Q569 588 565 589Q561 590 552 590Q538 590 531 593Q523 596 519 596Q515 596 508 599Q500 602 495 602Q491 602 481 607Q472 613 464 613Q457 613 449 616Q442 619 438 619Q433 619 426 622Q418 625 411 625Q401 625 391 634Q380 642 373 642Q369 642 362 645Q354 648 350 648Q346 648 338 651Q331 654 321 654Q311 654 303 657Q296 660 292 660Q287 660 280 663Q273 666 268 666Q259 666 246 673Q233 681 222 691Q212 702 210 710Q207 721 194 731Q180 741 163 745Q146 749 134 745Q131 743 115 742Q99 742 80 741Q60 741 44 741Q29 742 27 744Q19 748 8 762Q2 768 1 771Q0 775 0 789Q0 801 0 804Q1 807 3 808Q5 809 13 816Q27 829 32 829Q35 829 37 832Q39 834 52 835Q64 836 76 835Q89 834 91 832Q94 829 96 829Q98 829 108 823Q118 817 128 817Q147 817 173 799Q181 794 184 794Q186 794 194 790Q202 787 208 782Q216 777 219 777Q221 777 233 771Q246 765 248 765Q250 765 258 760Q278 747 304 747Q327 747 341 736Q350 729 358 726Q366 724 381 724Q409 724 432 712Q439 709 452 705Q465 701 470 701Q477 701 484 698Q491 695 508 695Q522 695 528 693Q535 691 547 683Q554 677 557 677Q559 677 572 672Q581 667 586 666Q591 666 612 666Q637 666 649 663Q661 660 671 651Q681 642 696 636Q712 631 724 631Q733 631 741 628Q746 626 754 625Q763 625 797 625H845L858 619Q867 615 870 614Q874 613 887 613Q899 613 902 612Q906 612 914 608Q924 604 931 602Q941 599 955 589Q963 584 968 584Q974 584 986 578Q997 573 1006 566Q1015 559 1015 555Q1015 553 1022 546Q1028 540 1033 537Q1035 536 1041 531Q1047 526 1053 520Q1059 514 1064 509Q1070 505 1071 505Q1072 504 1072 501Q1073 499 1073 491Q1073 483 1072 480Q1072 478 1071 477Q1068 476 1059 467Q1034 445 1015 453Q1011 455 1004 455Q998 456 978 456Z"/></g>
      ${shine('M24 50A38 38 0 0 1 44 27')}`,
  },
  // weekends are for capture-the-flag
  ctf: {
    label: 'weekends: ctf',
    outline: '#d7f25a',
    fill: '#f6ffc9',
    silhouette: '<rect x="20" y="12" width="10" height="98" rx="5"/><path d="M28 18Q48 6 66 18T106 18V64Q86 52 66 64T28 62Z"/>',
    detail: `<rect x="21" y="13" width="8" height="96" rx="4" fill="${INK}"/>
      <text x="66" y="51" font-size="34" ${HAND}>ctf</text>${shine('M38 22Q50 15 60 20')}`,
  },
  // canteen hot chocolate with a piece of Dairy Milk in it
  hotchocolate: {
    label: 'hot chocolate + dairy milk',
    outline: '#ece7df',
    fill: '#fffaf2',
    under: '<path d="M82 58H91A11 11 0 0 1 91 80H80" fill="none" stroke-width="20"/><rect x="56" y="18" width="24" height="34" rx="4" transform="rotate(16 68 35)"/>',
    silhouette: '<path d="M26 50H84V76A22 22 0 0 1 62 98H48A22 22 0 0 1 26 76Z"/>',
    detail: `<g transform="rotate(16 68 35)"><rect x="57" y="19" width="22" height="32" rx="3" fill="#6b3f2a"/><path d="M68 20V50M58 30H78M58 40H78" stroke="#4a2a1b" stroke-width="2"/></g>
      <path d="M26 50H84V76A22 22 0 0 1 62 98H48A22 22 0 0 1 26 76Z" fill="#fffaf2"/>
      <path d="M84 60H91A9 9 0 0 1 91 78H82" fill="none" stroke="#fffaf2" stroke-width="7"/>
      <path d="M33 57H77" stroke="#8a5a3c" stroke-width="7" stroke-linecap="round"/>
      <g fill="${INK}"><circle cx="46" cy="73" r="3.5"/><circle cx="64" cy="73" r="3.5"/></g>
      <path d="M50 81Q55 86 60 81" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <g fill="#ffb3a5"><circle cx="39" cy="79" r="3.5"/><circle cx="71" cy="79" r="3.5"/></g>
      <g fill="none" stroke="#ece7df" stroke-width="5" stroke-linecap="round"><path d="M38 38Q33 32 38 26T38 14"/></g>`,
  },
  // books and manga
  manga: {
    label: 'books + manga',
    outline: '#ff8fcf',
    fill: '#ffffff',
    silhouette: '<polygon points="60.0,10.0 69.6,24.3 85.0,16.7 86.2,33.8 103.3,35.0 95.7,50.4 110.0,60.0 95.7,69.6 103.3,85.0 86.2,86.2 85.0,103.3 69.6,95.7 60.0,110.0 50.4,95.7 35.0,103.3 33.8,86.2 16.7,85.0 24.3,69.6 10.0,60.0 24.3,50.4 16.7,35.0 33.8,33.8 35.0,16.7 50.4,24.3"/>',
    detail: `<text x="60" y="77" font-size="52" ${HAND}>!?</text>`,
  },
  // whatever last.fm says is on repeat
  record: {
    label: 'on repeat',
    outline: '#9b99ff',
    fill: INK,
    silhouette: '<circle cx="60" cy="60" r="46"/>',
    detail: `<g fill="none" stroke="#4a4444" stroke-width="2"><circle cx="60" cy="60" r="38"/><circle cx="60" cy="60" r="31"/><circle cx="60" cy="60" r="24"/></g>
      <circle cx="60" cy="60" r="16" fill="#9b99ff"/><circle cx="60" cy="60" r="3.5" fill="${INK}"/>
      <g fill="${INK}"><circle cx="54" cy="57" r="2"/><circle cx="66" cy="57" r="2"/></g>
      <path d="M26 46A37 37 0 0 1 46 26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.5"/>`,
  },
  // the letterboxd diary
  film: {
    label: 'letterboxd diary',
    outline: '#7cc4ff',
    fill: '#f3fbff',
    silhouette: '<rect x="16" y="46" width="88" height="56" rx="9"/><rect x="14" y="22" width="90" height="20" rx="6" transform="rotate(-9 16 42)"/>',
    detail: `<g transform="rotate(-9 16 42)"><rect x="15" y="23" width="88" height="18" rx="5" fill="${INK}"/>
      <g stroke="#f3fbff" stroke-width="7"><path d="M30 41 38 23M50 41 58 23M70 41 78 23M90 41 98 23"/></g></g>
      <path d="M16 62H104" stroke="${INK}" stroke-width="3"/>
      <text x="60" y="91" font-size="26" ${HAND}>take 2</text>`,
  },
  // built by hand, mostly
  vibecoded: {
    label: 'sometimes',
    outline: '#f5b83d',
    fill: '#fff3d6',
    silhouette: '<rect x="4" y="38" width="112" height="44" rx="22" transform="rotate(-7 60 60)"/>',
    detail: `<g transform="rotate(-7 60 60)"><text x="60" y="69" font-size="27" ${HAND}>vibecoded</text></g>`,
  },
}
