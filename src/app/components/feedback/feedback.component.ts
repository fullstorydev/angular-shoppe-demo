import { HostListener, Component } from "@angular/core"
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import * as FullStory from "@fullstory/browser"

export interface FeedbackData {
    nps: number // net promoter score
    osat: number // overall satisfaction
    comments: string // free-form text comments
}

@Component({
    selector: "app-feedback",
    templateUrl: "./feedback.component.html",
    styleUrls: ["./feedback.component.scss"],
})
export class FeedbackComponent {
    constructor(public dialog: MatDialog) {}

    @HostListener("window:feedback_submitted", ["$event"])
    trackFeedbackSubmitted(event: CustomEvent) {
        const data = event.detail
        // FullStory.setUserVars({
        //     displayName: `Hamburglar 🍔`,
        //     email: `Hamburglar@mcdonalds.com`
        //     rewardMbr_bool: true, // are they a member of the reward program?
        //     totalSpent_real: 14.5, // how much has he spent on in-app purchases so far?
        // })
        // const { nps, osat, comments } = data
        // const payload = {
        //     fsUID_str: window.localStorage.getItem("_fs_uid"),
        //     // email: `Hamburglar@mcdonalds.com`, //  destination-specific implementation nuance
        //     referrer: window.document.referrer,
        //     cartItems_strs: ["pear", "apple", "banana"],
        //     startOfPlayback_str: FullStory.getCurrentSessionURL(),
        //     playbackAtThisMomentInTime_str: FullStory.getCurrentSessionURL(true),
        //     campaignURL_str:
        //         "utm_source=google&utm_medium=cpc&utm_campaign=972631399&utm_group=52086501761&utm_term=fullstory",
        //     utm_source_str: "google",
        //     utm_medium_str: "cpc",
        //     utm_campaign_str: "972631399",
        //     utm_group_str: "52086501761",
        //     utm_term_str: "fullstory",
        //     nps_int: nps,
        //     osat_int: osat,
        //     comments_str: comments,
        // }

        // FullStory.event("feedback_submitted", payload)
        console.log("trackSurveyFeedback", data)
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(FeedbackDialog, {
            width: "800px",
        })

        dialogRef.afterClosed().subscribe((data) => {
            // if no data bail and log
            if (!data) {
                FullStory.log("warn", "feedback_submitted data not found")
                return
            }
            const { nps, osat, comments } = data

            // Who is the user?
            // You should not use FS.identify for anonymous or guest.
            // However, you can still attribute custom variables to unidentified users with FS.setUserVars.
            FullStory.setUserVars({
                displayName: `Hamburglar 🍔`,
                email: `Hamburglar@mcdonalds.com`,
                rewardMbr_bool: true, // are they a member of the reward program?
                totalSpent_real: 55.5, // how much have they spent on in-app purchases so far?
            })

            const payload = {
                fsUID_str: window.localStorage.getItem("_fs_uid"),
                // email: `Hamburglar@mcdonalds.com`, //  destination-specific implementation nuance
                referrer: window.document.referrer,
                cartItems_strs: ["pear", "apple", "banana"],
                startOfPlayback_str: FullStory.getCurrentSessionURL(),
                playbackAtThisMomentInTime_str: FullStory.getCurrentSessionURL(true),
                campaignURL_str:
                    "utm_source=google&utm_medium=cpc&utm_campaign=972631399&utm_group=52086501761&utm_term=fullstory",
                utm_source_str: "google",
                utm_medium_str: "cpc",
                utm_campaign_str: "972631399",
                utm_group_str: "52086501761",
                utm_term_str: "fullstory",
                nps_int: nps,
                osat_int: osat,
                comments_str: comments,
                rageclickedSurvery_bool: false,
            }

            // Events("feedback_submitted") are trackable actions
            // properties ("payload") is the data about the event that is sent with each event.
            FullStory.event("feedback_submitted", payload)
            // broadcasts a CustomEvent
            // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

            window.dispatchEvent(new CustomEvent("feedback_submitted", { detail: { nps, osat, comments } }))
        })
    }
}

@Component({
    selector: "app-feedback-dialog",
    templateUrl: "./feedback.dialog.html",
    styleUrls: ["./feedback.component.scss"],
})
export class FeedbackDialog {
    data: FeedbackData = {
        nps: 0,
        osat: 0,
        comments: "",
    }

    constructor(public dialogRef: MatDialogRef<FeedbackDialog>) {}

    close(): void {
        this.dialogRef.close()
    }
}
