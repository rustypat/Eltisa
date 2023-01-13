namespace  Eltisa.Source.Tools; 

using System;
using System.Threading;


public class PeriodicThread {

    private readonly int           wakeupPollingPeriod;
    private readonly long          workingPeriod;
    private long                   workingStart;
    private readonly Thread        thread;
    private bool                   keepRunning;

    public PeriodicThread(int workingPeriodMilliseconds, Action action, int wakeupPollingPeriodMilliseconds=1000) {
        wakeupPollingPeriod   = wakeupPollingPeriodMilliseconds;
        workingPeriod         = workingPeriodMilliseconds * TimeSpan.TicksPerMillisecond;
        keepRunning           = true;

        thread = new Thread(() => {
            while(keepRunning) {
                try {
                    System.Threading.Thread.Sleep(wakeupPollingPeriod);
                    if(DateTime.Now.Ticks - workingStart > workingPeriod ) {
                        workingStart = DateTime.Now.Ticks;
                        action();
                    }
                }catch(Exception e) {
                    Log.Error(e);
                }                    
            }                
        });
    }


    public void Start() {
        workingStart = DateTime.Now.Ticks;
        thread.Start();
    }


    public void RequestStop() {
        keepRunning = false;
    }

}