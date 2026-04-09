<?php

namespace App\Mail;

use App\Models\Jnf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JnfStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $jnf;
    public $status;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct(Jnf $jnf, $status, $reason = null)
    {
        $this->jnf = $jnf;
        $this->status = $status;
        $this->reason = $reason;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $type = $this->jnf->opportunity_type === 'internship' ? 'INF' : 'JNF';
        $subject = "[CDC IIT ISM] Your {$type} has been " . ucfirst($this->status);

        return $this->subject($subject)
                    ->view('emails.jnf_status_updated');
    }
}
