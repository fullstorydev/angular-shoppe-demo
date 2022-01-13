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
        // const { nps, osat, comments } = data
        // const payload = {
        //     uuid: window.localStorage.getItem("_fs_uid"),
        //     nps,
        //     osat,
        //     comments,
        //     startOfPlayback: FullStory.getCurrentSessionURL(),
        //     playbackAtThisMomentInTime: FullStory.getCurrentSessionURL(true),
        // }

        console.log("trackSurveyFeedback", data)
        // FullStory.event("feedback_submitted", payload)
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(FeedbackDialog, {
            width: "800px",
        })

        dialogRef.afterClosed().subscribe((data) => {
            if (!data) {
                FullStory.log("warn", "feedback_submitted data not found")
                return
            }
            const { nps, osat, comments } = data

            const payload = {
                _fs_uid: window.localStorage.getItem("_fs_uid"),
                startOfPlayback: FullStory.getCurrentSessionURL(),
                playbackAtThisMomentInTime: FullStory.getCurrentSessionURL(true),
                ...data,
            }
            FullStory.setUserVars({
                displayName: "Brown Cow 🐄 ",
                email: "thecowsarein@themeadow.com",
                totalSpent_real: 14.5, // how much has he spent on in-app purchases so far?
            })
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
