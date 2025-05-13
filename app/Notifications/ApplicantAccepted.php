<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\JobPost;

class ApplicantAccepted extends Notification
{
    use Queueable;
    protected $job;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobPost $job)
    {
        $this->job = $job;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'You have been accepted for a job!',
            'message' => "You’ve been accepted for the position: {$this->job->job_title}.",
            'timeAgo' => now()->diffForHumans(),
            'link' => "/job/{$this->job->job_post_id}", // adjust as needed
        ];
    }
}
