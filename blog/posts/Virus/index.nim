import nimib, nimislides # nimib/nimislides uses Markdown by default
import std/strformat, std/strutils, std/random, system
# import niml [html DSL]

# seed random functions
randomize()

# TITLE: Are Viruses still a thing?

nbInit(theme = revealTheme)
setSlidesTheme(Blood)
showSlideNumber()
useScrollWheel()
footer(&("[home](https://x3c4.club) - [mail @ x3c4.club (work)](mailto:mail@x3c4.club) - [mail@x3c4.club (personal/all)](mailto:mail@x3c4.club) - [twitter](https://twitter.com/x3c49)"))

## WHAT IS A VIRUS? HOW DO I GET ONE? HOW CAN I AVOID IT? THANKS.

# Highlight Colors
var virusHighlight = "#00FF08"
var malwareHighlight = "#FD5916"
var stdHighlight = "#F380FF"

# BACKGROUNDS SET AS VARIABLES HERE TO REDUCE BOILERPLATE

# Define elements of random background gradients
let 
    prefixes = ["linear", "radial"]
    primaryColors = ["#04D70D", "#04D70D", "#6904A5", "#FF0007", "#A81AC0", "#F64A29", "#125E3E", "#F7FF00", "#00F7FF", "#F800FF", "#000000", "#10D0C5"]
    secondaryColors = ["black", "white", "grey", "#D9A8A8", "#A8D9B2", "#44405F", "#9C9CCC", "#5B2757", "#83E5FF", "#913F24", "#862200", "#9DFF9B"]
# string to get random gradient every time file is recompiled
# Rand Gradients = &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})"


# image backgrounds
let
    firstImage = "backgrounds/dosvirus.gif"
    garyware = "backgrounds/garyware.PNG"
    garyware2 = "backgrounds/garyware2.PNG"



# First Level Indentation - Creates new slide entirely
slide(slideOptions(colorBackground="#000000")): #gradientBackground= &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})")):
    # Second Level Indentation - anything here and beyond will be a sub-slide.
    slide(slideOptions(imageBackground=firstImage)): # CREATE VIRUS VIDEO AND TURN INTO GIF LATER.  
        align("left"):
            nbText: "#### <span style=\"color:white\"> I'm sure you've heard of a computer virus and probably imagine something like this. 👆</span>"
            columns:
                column:
                    nbText: "<span style=\"color:white\"> You're probably wondering if this still exists.. Has Apple just made Virus proof computers? 😲 😲</span>"
                column:
                    nbText: "<span style=\"color:white\">I will try to answer your questions in these fun slides. Enjoy!</span>"
                    nbText: &"<span style=\"color:red\">CLICK THE NAVIGATION ARROWS (THE BOTTOM RIGHT) OR MOVE THE SCROLLWHEEL TO CONTINUE.</span>"
    slideAutoAnimate:                
        nbText: "Some slides will need to explain more, so keep clicking down until you can't. There is a number by the navigator that shows your slide number.<br><span style=\"color:red\">\\*Mobile Tip\\* You can swipe up and down to navigate.</span>"
        nbText: &"<br>Backgrounds that are not a image/gif/i-frame are<br>[[<span style=\"color:{stdHighlight}\">randomly generated</span>]] gradiets! Enjoy the slideshow."

slide(slideOptions(gradientBackground= &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})")):
    slideAutoAnimate:
        nbText: &("## What is a <span style=\"color:{virusHighlight}\">Virus</span>?") ## ON LAST SLIDE MENTION DO MACS/MOBILE DEVICES GET MALWARE.
        fragment(fadeDown):
            nbText: &("A <span style=\"color:{virusHighlight}\"> virus </span> is a type of <span style=\"color:{malwareHighlight}\"> *malware* </span> that attaches to another program and replicates itself on execution, like a [virus](https://en.wikipedia.org/wiki/Virus) multiplies in your body.")

    slide:
        nbText: &("## Wait, <span style=\"color:{malwareHighlight}\"> *malware??* </span>??")
        fragment(fadeDown):
            nbText: &("<span style=\"color:{malwareHighlight}\"> **Malware** </span>, or *malicious-software* is a term that describes any program that was <span style=\"color:{stdHighlight}\"> intentionally written to cause malice</span>.")
            fragment:
                nbText: &("<span style=\"color:{stdHighlight}\"> *Malice* </span> could mean a lot of things, but it's commonly used to <span style=\"color:{stdHighlight}\"> make money off you </span> (steal your personal information), <span style=\"color:{stdHighlight}\"> stop your ability to do a job</span>, or <span style=\"color:{stdHighlight}\"> to make a political statement</span>.")
    slide:
        nbText: &("But if the average person like you or I had <span style=\"color:{malwareHighlight}\"> malware</span>, they'd be after our <span style=\"color:{stdHighlight}\"> money</span>. Nobody is looking to make a **political statement** with the stuff we're trying to hide.")


slide(slideOptions(gradientBackground= &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})")):
    slideAutoAnimate:
        nbText: &("#### How do I get <span style=\"color:{malwareHighlight}\">malware</span>? How do I know if I already have it?")
    slideAutoAnimate:
        nbText: &("#### How do I get <span style=\"color:{malwareHighlight}\">malware</span>? How do I know if I already have it?")
        nbText: &("You get infected with <span style=\"color:{malwareHighlight}\">malware</span> when you download a file (<span style=\"color:{stdHighlight}\">with or without your knowledge</span>) and it's malicious.")
        fragment:
            nbText: &("There isn't one way to know if you have malware. Usually it will start some <span style=\"color:{stdHighlight}\"> *weird*  behavior on your desktop</span>, <span style=\"color:{stdHighlight}\">or more resourses used at rest </span>(CPU, Memory, GPU Power).")
            nbText: &("**But this is not always the case!! Sometimes <span style=\"color:{malwareHighlight}\">malware</span> can conceal itself very well, <span style=\"color:{stdHighlight}\">[asymptomatic](https://en.wikipedia.org/wiki/Asymptomatic)</span> in a sense.**")

    slide:
        nbText: &("\\*examples to come\\*")


slide(slideOptions(gradientBackground= &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})")):
    slide:
        nbText: &("#### How do I avoid <span style=\"color:{malwareHighlight}\">malware</span>? How can I tell if a program is <span style=\"color:{malwareHighlight}\">malware</span>?")
        fragment(fadeDown):
            nbText: &("You can avoid <span style=\"color:{malwareHighlight}\">malware</span> by thinking twice about the links and redirects you click on!")
    slide:
        nbText: &("#### <span style=\"color:{stdHighlight}\"> If it's too good to be true, it is!!!! </span>")
        fragment:
            nbText: &("<span style=\"color:{stdHighlight}\">No</span>, you can't download Minecraft for free from freemcdownload.er")
            fragment:
                nbText: &("<span style=\"color:{stdHighlight}\">No</span>, those Valorant and CS cheats you saw on tiktok are not safe.")
                fragment: 
                    nbText: &("If you download some shady things like this and start experiencing weird behavior on your computer, <span style=\"color:{stdHighlight}\">that program could've been</span> <span style=\"color:{malwareHighlight}\"> malware</span>.")
    slide:
        nbText: &("Clicking on something is not the only way to be infected, but for the average person it covers 95% of malware we will experience.")
        fragment:
            nbText: &("## <span style=\"color:{stdHighlight}\">Protect yourself</span><span style=\"color:red\">!</span>")
            nbText: &("⬇️ Go down for examples ⬇️")
    slide(slideOptions(imageBackground=garyware)):
        nbText: &"<span style=\"color:red\">As I said before, usually the process of infecting you with malware is started by clicking something you shouldn't..</span><br><br>"
        nbText: &"<span style=\"color:red\">In this \"Free Valorant Cheats\" video, the user urges you to click the link which will have you download a file.</span>"
        #nbCodeInBlock: discard
    slide(slideOptions(imageBackground=garyware2)):
        nbText: &"<span style=\"color:red\">As you can see, the link is:</span>"
        nbText: &"<span style=\"color:red\">(((((<span style=\"color:{stdHighlight}\">**Do Not visit this link**</span>)))))</span>"
        nbCodeInBlock: 
            discard   "https://upload[.]advgroup[.]ru/LnCxTJL9"
        nbClearOutput()
    slide(slideOptions(imageBackground=garyware2)):
        nbText: &"<span style=\"color:#2EB798\">Some <span style=\"color:{stdHighlight}\">immediate</span> signs to me that it's a malware infection campaign is: </span>"
        columns:
            column:
                nbText: "<span style=\"color:black\">Too good<br> to be true:<br>works hard on a program that is very saught after then gives it out for free? hmm...</span>"
            column:
                nbText: "<span style=\"color:orange\">Troubleshooting tips include disabling Anti-Virus. This should immediately mean it's trying to evade your A-V.</span>"
            column:
                nbText: "<span style=\"color:red\">The File is zipped with a password. This is done to evade YouTube's anti malicious-link functionality.</span>"

slide(slideOptions(gradientBackground= &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})")):
    slide:
        nbText: &("#### How to remove <span style=\"color:{malwareHighlight}\">malware</span>.")
        fragment:
            columns: 
                column:
                    nbText: &("<br>There are a few ways to remove <span style=\"color:{malwareHighlight}\">malware</span>, including (<span style=\"color:{stdHighlight}\">but not limited to</span>).")
                column:
                    nbText: &("<br>1. \"Anti-Virus\" or Anti-Malware suites <br>2. Formatting your physical drive<br>3. Running a Windows Defender scan.")

    slideAutoAnimate:
        nbText: &("#### The next few slides will load an interactive webpage in the backgroud")
    slideAutoAnimate:
        nbText: &("#### The next few slides will load an interactive webpage in the backgroud")
        nbText: &("They're articles that explain how to do the activities mentioned above to remove <span style=\"color:{malwareHighlight}\">malware</span>.")
        nbText: &("<span style=\"color:red\">WARNING</span>: pages take a second to load.")

    slide(slideOptions(autoAnimate = true, iframeBackground="https://www.hobsoft.com/best-malware-removal/", iframeInteractive = true)):
        nbText: &(" <span style=\"color:black\">AntiMalware suites</span>") # LIST AVs

    slide(slideOptions(iframeBackground="https://windowsreport.com/12068-wipe-a-hard-drive-windows-8/", iframeInteractive = true)):
        nbText: &("<span style=\"color:black\"> How to format drive (Windows) </span>") # I-FRAME
    slide(slideOptions(iframeBackground="https://support.microsoft.com/en-us/topic/how-to-start-a-scan-for-viruses-or-malware-in-microsoft-defender-e98663f1-8827-4abe-b9ce-fb2664201f29", iframeInteractive = true)):
        nbText: &("<span style=\"color:black\">Running a Windows Defender scan</span>") # I-FRAME
    
slide(slideOptions(gradientBackground= &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})")):
    slide(slideOptions(imageBackground="backgrounds/avmidwit.png")):
        nbText: &("<br> <span style=\"color:{stdHighlight}\">Although it will help, Anti-Virus is merely a tool and it all comes down recognizing [phishing](https://en.wikipedia.org/wiki/Phishing) so you don't get infected..</span>") 

    slideAutoAnimate:
        nbText: &("Anti-Virus works by using a big database with [signatures](https://www.howtogeek.com/363735/what-is-a-checksum-and-why-should-you-care/) of existing malware programs from the wild, and blocking a program on your computer if it's signature is similar to one existing in it's database...")
    slideAutoAnimate:
        nbText: &("Anti-Virus works by using a big database with [signatures](https://www.howtogeek.com/363735/what-is-a-checksum-and-why-should-you-care/) of existing malware programs from the wild, and blocking a program on your computer if its signature is similar enough to one existing in it's database...")
        nbText: &("### <span style=\"color:{stdHighlight}\">This is flawed.</span>")
    slideAutoAnimate:
        nbText: &"For the average person this approach *should* work. \"Hackers\" aren't specially crafting malware for the systems that we play Fortnite and watch movies on."
    slideAutoAnimate:
        nbText: &"For the average person this approach *should* work. \"Hackers\" aren't specially crafting malware for the systems that we play Fortnite and watch movies on."
        nbText: &"This is entirely different for companies that have datacenters with computers holding millions of dollars, or for military operated computers with confidential info on them."

slide(slideOptions(gradientBackground= &"{prefixes[find(prefixes, sample(prefixes))]}-gradient({primaryColors[find(primaryColors, sample(primaryColors))]}, {secondaryColors[find(secondaryColors, sample(secondaryColors))]})")):
    slideAutoAnimate:
        nbText: &("Protecting yourself from malware and phishing isn't just important for organizations, but for every single person that uses the internet.<br>(yes, you too.)")
    slideAutoAnimate:
        nbText: &("The entire world is starting to be run on the internet. More and more people nowadays have banking, housing, income, conversations, personal documents, PASSWORDS, and more all hosted on the internet or on a computer somewhere (phones are computers).")
    slideAutoAnimate:
        nbText: &("The entire world is run starting to be run on the internet. More and more people nowadays have banking, housing, income, conversations, personal documents, and more all hosted on the internet or on a computer somewhere (phones are computers).")
        nbText: &"Simply watching out for phishing, and watching what you download will protect you much better than any anti-virus ever will."
    

slide(slideOptions(gradientBackground="radial-gradient(#A81AC0, white)")):
    slideAutoAnimate:
        nbText: &("Thank you for reading!")
    slideAutoAnimate:
        nbText: &("Thank you for reading!")
        nbText: &("#### powered by [nimlang](https://nim-lang.org/)")
    slideAutoAnimate:
        nbText: &("Thank you for reading!")
        nbText: &("#### powered by [nimlang](https://nim-lang.org/)")
        nbText: &("source code: [</>](https://github.com/0xEc4y/0xec4y.github.io/blob/main/posts/Virus/index.nim)")
nbSave()
